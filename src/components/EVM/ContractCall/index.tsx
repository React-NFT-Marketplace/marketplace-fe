import { ethers, Contract } from 'ethers';
import { ChainConfigs } from '..';
import MessageSender from '../../../ABI/MessageSender.json';
import MessageReceiver from '../../../ABI/MessageReceiver.json';
import OneNFT from '../../../ABI/OneNFT.json';
import NFTMarketplace from '../../../ABI/NFTMarketplaceV2.json';
import IAxelarGateway from '../../../ABI/IAxelarGateway.json';
import IERC20 from '../../../ABI/IERC20.json';
import aUSDC from '../../../ABI/aUSDC.json';
import _ from 'lodash';
import axios from 'axios';
import { getBase64, getBaseUrl, ucFirst, uppercase } from '../../../common/utils';
import { ChainConfig } from '../ChainConfigs/types';
// import { BSC_TEST, POLYGON_TEST, BSC, POLYGON } from '../../../src/components/EVM/ChainConfigs';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';
import { ListedToken, Transaction } from './types';
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
    aUSDC: Contract;

    constructor() {
        // get chain nft contract address
        const chain: ChainConfig | undefined = _.find(chains, { id: Number(window.ethereum!.networkVersion) });

        this.chainConfig = chain!;
        this.provider = new ethers.providers.Web3Provider(window.ethereum as any);
        this.signer = this.provider.getSigner();
        this.messageSender = new ethers.Contract(chain!.messageSender!, MessageSender.abi, this.signer);
        this.messageReceiver = new ethers.Contract(chain!.messageReceiver!, MessageReceiver.abi, this.signer);
        this.oneNFT = new ethers.Contract(chain!.oneNFT!, OneNFT.abi, this.signer);
        this.NFTMarketplace = new ethers.Contract(chain!.nftMarketplace!, NFTMarketplace.abi, this.signer);
        this.IAxelarGateway = new ethers.Contract(chain!.gateway!, IAxelarGateway.abi, this.signer);
        this.IERC20 = new ethers.Contract(chain!.crossChainToken!, IERC20.abi, this.signer);
        this.aUSDC = new ethers.Contract(chain!.crossChainToken!, aUSDC.abi, this.signer);
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

    getWalletUSDCBal = async () => {
        const balance = await this.aUSDC.balanceOf(window.ethereum!.selectedAddress);
        const tokenDecimal = 6;
        // to align some token that are not 18 decimals (ecc, eifi)
        let decimalPad = (18 - tokenDecimal);
        decimalPad = (decimalPad == 0) ? 1 : Number(10) ** decimalPad;


        return ethers.utils.formatEther(balance.mul(decimalPad));
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

        const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

        // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
        const gasFee = await api.estimateGasFee(
            fromChain.evmChain!,
            toChain.evmChain!,
            fromChain.gasToken!,
            1000000,
            2
        );

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

        const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

        // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
        const gasFee = await api.estimateGasFee(
            fromChain.evmChain!,
            toChain.evmChain!,
            fromChain.gasToken!,
            1000000,
            2
        );

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

        const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

        // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
        const gasFee = await api.estimateGasFee(
            fromChain.evmChain!,
            toChain.evmChain!,
            fromChain.gasToken!,
            1000000,
            2
        );

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
    }

    mint = async (toChainId: number, name: string, description: string, imageBlob: Blob) => {

        if(!window.ethereum) {
            return;
        }

        const fromChainId = window.ethereum.networkVersion;
        let hash = await fetch(`https://api.onenft.shop/premint/${fromChainId}`);
        hash = await hash.json();
        let content = await getBase64(imageBlob);

        let mintData = {
            name: name,
            description: description,
            path: imageBlob.name,
            content: content,
            hash: hash,
            fromChain: fromChainId,
            toChain: toChainId.toString(),
            creator: window.ethereum.selectedAddress,
            tx: '',
            tokenURI: '',
        };

        try {
            let res = await axios
                                .request({
                                    method: 'POST',
                                    url: 'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
                                    headers: {
                                        accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY
                                    },
                                    data: JSON.stringify([{
                                        path: mintData.path,
                                        content: mintData.content
                                    }])
                                });
            mintData.tokenURI = res.data[0].path;
        }

        catch (error){
            console.error(error);
            alert('Error Uploading..');
            return;
        }

        //mint
        if (mintData.fromChain == mintData.toChain) {
            console.log(`Same chain tx`);
            // same chain mint

            const currChain = _.find(ChainConfigs, {
                id: Number(mintData.fromChain)
            });

            const nftContract = this.oneNFT;
            const receipt = await nftContract.mint(mintData.tokenURI).then((tx: any) => tx.wait());

            const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
            mintData.tx = `${currChain!.blockExplorerUrl}/tx/${txHash}`;
        }

        else {
            // cross chain mint
            // might not work yet

            const fromChain = _.find(ChainConfigs, {
                id: Number(mintData.fromChain)
            });
            const toChain = _.find(ChainConfigs, {
                id: Number(mintData.toChain)
            });

            const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

            // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
            const gasFee = await api.estimateGasFee(
                fromChain!.evmChain!,
                toChain!.evmChain!,
                fromChain!.gasToken!,
                1000000,
                2
            );

            console.log(`Cross chain tx ${fromChain!.name} => ${toChain!.name}`);

            const crossMarketplaceContract = new ethers.Contract(
                fromChain!.messageSender!,
                this.messageSender.abi,
                this.provider.getSigner(),
            );

            const receipt = await crossMarketplaceContract.crossChainMint(
                    uppercase(toChain!.evmChain!),
                    toChain!.messageReceiver,
                    mintData.tokenURI,
                    {
                        value: BigInt(gasFee)
                    },
                )
                .then((tx: any) => tx.wait());;

            mintData.tx = `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;
        }
    }

    getAllNFTs = async(): Promise<ListedToken[]> => {
        let data: ListedToken[] = await this.NFTMarketplace.getAllListedNFTs();
        data = _.filter(data, (d: ListedToken) => {
            return (d.tokenId).toString() != "0";
        });
        return data;
    }
}
