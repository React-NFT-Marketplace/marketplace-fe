import { ethers, Contract } from 'ethers';
import { ChainConfigs } from '..';
import MessageSender from '../../../ABI/MessageSender.json';
import MessageReceiver from '../../../ABI/MessageReceiver.json';
import OneNFT from '../../../ABI/OneNFT.json';
import NFTMarketplace from '../../../ABI/NFTMarketplaceV2.json';
import IAxelarGateway from '../../../ABI/IAxelarGateway.json';
import IERC20 from '../../../ABI/IERC20.json';
import _ from 'lodash';
import axios from 'axios';
import { getBaseUrl, ucFirst } from '../../../common/utils';
import { ChainConfig } from '../ChainConfigs/types';
// import { BSC_TEST, POLYGON_TEST, BSC, POLYGON } from '../../../src/components/EVM/ChainConfigs';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';
import { Transaction } from './types';
import { requestSwitchChain } from '../Switcher';
const isTestnet = process.env.REACT_APP_CHAIN_ENV === "testnet";
// assign chain info based on env
// const BscChain = isTestnet ? BSC_TEST : BSC;
// const PolygonChain = isTestnet ? POLYGON_TEST : POLYGON;

const chains = ChainConfigs;
export default class ContractCall {
    provider: ethers.providers.JsonRpcProvider;
    chainConfig: ChainConfig;
    signer: ethers.providers.JsonRpcSigner;
    messageSender: Contract;
    messageReceiver: Contract;
    oneNFT: Contract;
    NFTMarketplace: Contract;
    IAxelarGateway: Contract;
    IERC20: Contract;

    constructor(id: number) {
        // get chain nft contract address
        const chain: ChainConfig | undefined = _.find(chains, { id });

        this.chainConfig = chain!;
        this.provider = new ethers.providers.Web3Provider(window.ethereum as any);
        this.signer = this.provider.getSigner();
        this.messageSender = new ethers.Contract(chain!.messageSender!, MessageSender.abi, this.signer);
        this.messageReceiver = new ethers.Contract(chain!.messageReceiver!, MessageReceiver.abi, this.signer);
        this.oneNFT = new ethers.Contract(chain!.oneNFT!, OneNFT.abi, this.signer);
        this.NFTMarketplace = new ethers.Contract(chain!.nftMarketplace!, NFTMarketplace.abi, this.signer);
        this.IAxelarGateway = new ethers.Contract(chain!.gateway!, IAxelarGateway.abi, this.signer);
        this.IERC20 = new ethers.Contract(chain!.crossChainToken!, IERC20.abi, this.signer);
    }

    getSignature = async (
        contractName: string,
        verifyingContract: string,
        spender: string,
        tokenId: number,
        chainId: number,
        nonce: number,
        deadline: number
    ) => {

        if(!window.ethereum) {
            return;
        }

        const typedData = {
            types: {
                Permit: [
                    { name: "spender", type: "address" },
                    { name: "tokenId", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            },
            primaryType: "Permit",
            domain: {
                name: contractName,
                version: "1",
                chainId: chainId,
                verifyingContract: verifyingContract,
            },
            message: {
                spender,
                tokenId,
                nonce,
                deadline
            },
        };

        // sign Permit
        const signature = await this.signer._signTypedData(
            typedData.domain,
            { Permit: typedData.types.Permit },
            typedData.message
        );

        return signature;
    }

    /* showTxUrl = (url) => {
        Swal.fire({
            title: 'Done!',
            showConfirmButton: true,
            allowOutsideClick: false,
            html: `<a target="_blank" href="${url}">${url}</a>`
        });
    } */


    getGatewayContract = (chain: ChainConfig) => {
        return new Contract(chain.gateway!, IAxelarGateway.abi, this.provider.getSigner());
    }

    getMessageSenderContract = (chain: ChainConfig) => {
        return new Contract(chain.messageSender!, MessageSender.abi, this.provider.getSigner());
    }

    getMessageReceiverContract = (chain: ChainConfig) => {
        return new Contract(chain.messageReceiver!, MessageReceiver.abi, this.provider.getSigner());
    }

    getMarketplaceContract = (chain: ChainConfig) => {
        return new Contract(chain.nftMarketplace!, NFTMarketplace.abi, this.provider.getSigner());
    }

    saveActionLog = async(toChain: number, tokenId: number, tx: string, action: string) => {
        let data = JSON.stringify({
            "toChain": toChain,
            "fromChain": window.ethereum!.networkVersion,
            "tokenId": tokenId,
            "address": window.ethereum!.selectedAddress,
            "tx": tx
        });

        // action = listNft | delistNft | buyNft
        axios({
            method: "POST",
            url: `https://api.onenft.shop/${action}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data
        })
            .then(function (response: any) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }

    callList = async (tokenId: number, price: number) => {
        if(!window.ethereum) {
            return;
        }

        if (!window.ethereum.selectedAddress) {
            alert('Not connected');
            return;
        }

        if (!window.ethereum.networkVersion) {
            alert('Not connected');
            return;
        }

        const fromChain = _.find(ChainConfigs, {id: Number(window.ethereum!.networkVersion)});

        if (!fromChain) {
            alert('Chain not supported');
            return;
        }

        // hard code to one day from now
        const deadline = Math.round(Date.now() / 1000 + (7 * 24 * 60 * 60));

        //switch to target chain
        const contractName = await this.NFTMarketplace.name();
        const nftNonce = await this.NFTMarketplace.nonces(tokenId);

        // await marketplaceContract.approve(marketplaceContract.address, tokenId);

        // gasless call
        const signature = await this.getSignature(contractName, fromChain.nftMarketplace!, window.ethereum.selectedAddress, tokenId, fromChain.id, nftNonce, deadline);
        // console.log(`here ${signature}`);

        // gasless call
        const receipt = await this.NFTMarketplace.setListTokenGasless(tokenId, ethers.utils.parseUnits(price.toString(), 6), deadline, signature);

        // const receipt = await marketplaceContract.setListToken(tokenId, window.ethers.utils.parseUnits(price.toString(), 6));


        /* console.log({
          txHash: receipt.transactionHash,
        });
        onSent(receipt.transactionHash); */
        console.log(receipt);
        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        const txUrl = `${fromChain.blockExplorerUrl}/tx/${txHash}`;

        await this.saveActionLog(fromChain.id, tokenId, txUrl, 'listNft');
    }

    callDelist = async (tokenId: number) => {
        if (!window.ethereum?.selectedAddress) {
            alert('Not connected');
            return;
        }

        if (!window.ethereum.networkVersion) {
            alert('Not connected');
            return;
        }

        let fromChain = _.find(ChainConfigs, {id: Number(window.ethereum.networkVersion)});

        if (!fromChain) {
            alert('Chain not supported');
            return;
        }

        const receipt = await this.NFTMarketplace
            .delistToken(
                tokenId
            )
            .then((tx: any) => tx.wait());

        console.log(receipt);
        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        const txUrl = `${fromChain.blockExplorerUrl}/tx/${txHash}`;

        await this.saveActionLog(fromChain.id, tokenId, txUrl, 'delistNft');
    }

    callBuy = async (
        amount: string,
        tokenId: number
    ) => {
        if (!window.ethereum?.selectedAddress) {
            alert('Not connected');
            return;
        }

        if (!window.ethereum.networkVersion) {
            alert('Not connected');
            return;
        }

        let fromChain = _.find(ChainConfigs, {id: Number(window.ethereum.networkVersion)});

        if (!fromChain) {
            alert('Chain not supported');
            return;
        }

        // Get token address from the gateway contract
        const tokenAddress = await this.NFTMarketplace.getReceivingToken();

        const erc20 = new Contract(
            tokenAddress,
            this.IERC20.abi,
            this.provider.getSigner(),
        );

        // Approve the token for the amount to be sent
        await erc20
            .approve(this.NFTMarketplace.address, ethers.utils.parseUnits(amount, 6))
            .then((tx: any) => tx.wait());

        const receipt = await this.NFTMarketplace
            .executeSale(
                tokenId
            )
            .then((tx: any) => tx.wait());

        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        const txUrl = `${fromChain.blockExplorerUrl}/tx/${txHash}`;

        await this.saveActionLog(fromChain.id, tokenId, txUrl, 'buyNft');
    }

    // cross chain stuff
    crossChainList = async (toChainId: number, tokenId: number, price: string) => {
        if (!window.ethereum?.selectedAddress) {
            alert('Not connected');
            return;
        }

        if (!window.ethereum.networkVersion) {
            alert('Not connected');
            return;
        }

        const fromChain = _.find(ChainConfigs, {id: Number(window.ethereum.networkVersion)});
        const toChain = _.find(ChainConfigs, {id: Number(toChainId)});

        if (!fromChain) {
            alert('Chain not supported');
            return;
        }

        if (!toChain) {
            alert('Destination chain not supported');
            return;
        }

        let { data: gasFee } = await axios.get(`https://api.onenft.shop/estimateGas/${fromChain.id}/${toChain.id}`);

        // hard code to one day from now
        const deadline = Math.round(Date.now() / 1000 + (7 * 24 * 60 * 60));

        // // get chain configs
        // const currentChainConfig = window.getChainConfig(window.ethereum.networkVersion);
        // const destChainConfig = window.getChainConfig(destinationChainHexId);

        //switch to target chain
        await requestSwitchChain(toChain);
        const destMarketplace = this.getMarketplaceContract(toChain);
        const destContract = this.getMessageReceiverContract(toChain);
        const contractName = await destMarketplace.name();
        const nftNonce = await destMarketplace.nonces(tokenId);

        const signature = await this.getSignature(contractName, toChain.nftMarketplace!, toChain.messageReceiver!, tokenId, toChain.id, nftNonce, deadline);

        //switch back to current chain
        await requestSwitchChain(fromChain);
        const sourceContract = this.getMessageSenderContract(fromChain);

        const receipt = await sourceContract
            .crossChainList(
                toChain.name,
                destContract.address,
                tokenId,
                ethers.utils.parseUnits(price.toString(), 6),
                deadline,
                signature,
                {
                    value: BigInt(gasFee)
                },
            )
            .then((tx: any) => tx.wait());

        /* console.log({
          txHash: receipt.transactionHash,
        });
        onSent(receipt.transactionHash); */
        const txUrl  = `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;

        await this.saveActionLog(toChain.id, tokenId, txUrl, 'listNft');
    }

    // cross chain delist
    crossChainDelist = async (toChainId: number, tokenId: number) => {
        if (!window.ethereum?.selectedAddress) {
            alert('Not connected');
            return;
        }

        if (!window.ethereum.networkVersion) {
            alert('Not connected');
            return;
        }

        const fromChain = _.find(ChainConfigs, {id: Number(window.ethereum.networkVersion)});
        const toChain = _.find(ChainConfigs, {id: Number(toChainId)});

        if (!fromChain) {
            alert('Chain not supported');
            return;
        }

        if (!toChain) {
            alert('Destination chain not supported');
            return;
        }

        let { data: gasFee } = await axios.get(`https://api.onenft.shop/estimateGas/${fromChain.id}/${toChain.id}`);

        const sourceContract = this.getMessageSenderContract(fromChain);
        const destContract = this.getMessageReceiverContract(toChain);

        const receipt = await sourceContract
            .crossChainDelist(
                toChain.name,
                destContract.address,
                tokenId,
                {
                    value: BigInt(gasFee)
                },
            )
            .then((tx: any) => tx.wait());

        const txUrl  = `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;

        await this.saveActionLog(toChain.id, tokenId, txUrl, 'delistNft');
    }

    crossChainBuy = async (
        toChainId: number,
        amount: string,
        tokenId: number
    ) => {
        if (!window.ethereum?.selectedAddress) {
            alert('Not connected');
            return;
        }

        if (!window.ethereum.networkVersion) {
            alert('Not connected');
            return;
        }

        const fromChain = _.find(ChainConfigs, {id: Number(window.ethereum.networkVersion)});
        const toChain = _.find(ChainConfigs, {id: Number(toChainId)});

        if (!fromChain) {
            alert('Chain not supported');
            return;
        }

        if (!toChain) {
            alert('Destination chain not supported');
            return;
        }

        let { data: gasFee } = await axios.get(`https://api.onenft.shop/estimateGas/${fromChain.id}/${toChain.id}`);

        const srcGatewayContract = this.getGatewayContract(fromChain);
        const sourceContract = this.getMessageSenderContract(fromChain);
        const destContract = this.getMessageReceiverContract(toChain);

        // Get token address from the gateway contract
        const tokenAddress = await srcGatewayContract.tokenAddresses("aUSDC");


        const erc20 = new Contract(
            tokenAddress,
            this.IERC20.abi,
            this.provider.getSigner(),
        );

        // Approve the token for the amount to be sent
        await erc20
            .approve(sourceContract.address, ethers.utils.parseUnits(amount, 6))
            .then((tx: any) => tx.wait());

        const receipt = await sourceContract
            .crossChainBuy(
                toChain.name,
                destContract.address,
                "aUSDC",
                ethers.utils.parseUnits(amount, 6),
                tokenId,
                {
                    value: BigInt(gasFee)
                },
            )
            .then((tx: any) => tx.wait());

        /* console.log({
          txHash: receipt.transactionHash,
        });
        onSent(receipt.transactionHash); */

        const txUrl  = `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;

        await this.saveActionLog(toChain.id, tokenId, txUrl, 'buyNft');
    }
}
