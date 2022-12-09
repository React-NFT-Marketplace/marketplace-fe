import { ethers, Contract, BigNumber } from 'ethers';
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
import { getBase64, getBaseUrl, ucFirst, uppercase, generateId, uploadToIPFS } from '../../../common/utils';
import { ChainConfig } from '../ChainConfigs/types';
// import { BSC_TEST, POLYGON_TEST, BSC, POLYGON } from '../../../src/components/EVM/ChainConfigs';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';
import { HolderToken, ListedToken, Transaction } from './types';
import { requestSwitchChain } from '../Switcher';
const isTestnet = process.env.REACT_APP_CHAIN_ENV === "testnet";
// assign chain info based on env
// const BscChain = isTestnet ? BSC_TEST : BSC;
// const PolygonChain = isTestnet ? POLYGON_TEST : POLYGON;

const chains = ChainConfigs;
export default class ContractCall {
    provider?: ethers.providers.JsonRpcProvider;
    chainConfig?: ChainConfig;
    signer?: ethers.providers.JsonRpcProvider | ethers.providers.JsonRpcSigner;
    messageSender?: Contract;
    messageReceiver?: Contract;
    oneNFT?: Contract;
    batchOneNFT?: Contract;
    NFTMarketplace?: Contract;
    batchNFTMarketplace?: Contract;
    IAxelarGateway?: Contract;
    IERC20?: Contract;
    aUSDC?: Contract;

    constructor(chainId: number | null = null) {
        // get chain nft contract address
        const chain: ChainConfig | undefined = _.find(chains, { id: (chainId? Number(chainId) : Number(window.ethereum!.networkVersion)) });

        if(chain) {
            this.chainConfig = chain;
            this.provider = chainId? new ethers.providers.JsonRpcProvider(chain.rpc) : new ethers.providers.Web3Provider(window.ethereum as any);
            this.signer = chainId? this.provider : this.provider.getSigner();

            this.messageSender = new ethers.Contract(chain!.messageSender!, MessageSender.abi, this.signer);
            this.messageReceiver = new ethers.Contract(chain!.messageReceiver!, MessageReceiver.abi, this.signer);
            this.oneNFT = new ethers.Contract(chain!.oneNFT!, OneNFT.abi, this.signer);
            this.batchOneNFT = new ethers.Contract(chain!.oneNFT!, OneNFT.abi, this.provider);
            this.NFTMarketplace = new ethers.Contract(chain!.nftMarketplace!, NFTMarketplace.abi, this.signer);
            this.batchNFTMarketplace = new ethers.Contract(chain!.nftMarketplace!, NFTMarketplace.abi, this.provider);
            this.IAxelarGateway = new ethers.Contract(chain!.gateway!, IAxelarGateway.abi, this.signer);
            this.IERC20 = new ethers.Contract(chain!.crossChainToken!, IERC20.abi, this.signer);
            this.aUSDC = new ethers.Contract(chain!.crossChainToken!, aUSDC.abi, this.signer);


        }
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

        const signer = this.signer as ethers.providers.JsonRpcSigner;

        // sign Permit
        const signature = await signer._signTypedData(
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
        if(!this.provider) {
            return;
        }
        return new Contract(chain.gateway!, IAxelarGateway.abi, this.provider.getSigner());
    }

    getMessageSenderContract = (chain: ChainConfig) => {
        if(!this.provider) {
            return;
        }
        return new Contract(chain.messageSender!, MessageSender.abi, this.provider.getSigner());
    }

    getMessageReceiverContract = (chain: ChainConfig) => {
        if(!this.provider) {
            return;
        }
        return new Contract(chain.messageReceiver!, MessageReceiver.abi, this.provider.getSigner());
    }

    getNFTContract = (chain: ChainConfig) => {
        if(!this.provider) {
            return;
        }
        return new Contract(chain.oneNFT!, OneNFT.abi, this.provider.getSigner());
    }

    getMarketplaceContract = (chain: ChainConfig) => {
        if(!this.provider) {
            return;
        }
        return new Contract(chain.nftMarketplace!, NFTMarketplace.abi, this.provider.getSigner());
    }

    getWalletUSDCBal = async () => {
        if(!this.aUSDC) {
            return 0;
        }
        const balance = await this.aUSDC.balanceOf(window.ethereum!.selectedAddress);
        const tokenDecimal = 6;
        // to align some token that are not 18 decimals (ecc, eifi)
        let decimalPad = (18 - tokenDecimal);
        decimalPad = (decimalPad == 0) ? 1 : Number(10) ** decimalPad;


        return ethers.utils.formatEther(balance.mul(decimalPad));
    }

    callList = async (tokenId: number, price: number) => {
        if(!this.NFTMarketplace) {
            return;
        }

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
        const deadline = Math.round(Date.now() / 1000 + (1 * 24 * 60 * 60));

        //switch to target chain
        const contractName = await this.oneNFT!.name();
        const nftNonce = await this.oneNFT!.nonces(tokenId);

        // await marketplaceContract.approve(marketplaceContract.address, tokenId);

        // gasless call
        const signature = await this.getSignature(contractName, fromChain.oneNFT!, fromChain.nftMarketplace!, tokenId, fromChain.id, nftNonce, deadline);
        // console.log(`here ${signature}`);

        // list for how long? (default 14 days)
        let currentTime = new Date();
        currentTime.setDate(currentTime.getDate()+14);
        const listExpiry = Math.round(currentTime.getTime() / 1000);

        // gasless call
        const receipt = await(await this.NFTMarketplace.makeItem(fromChain.oneNFT, tokenId, ethers.utils.parseUnits(price.toString(), 6), listExpiry, deadline, signature)).wait(1);

        // const receipt = await marketplaceContract.setListToken(tokenId, window.ethers.utils.parseUnits(price.toString(), 6));


        /* console.log({
          txHash: receipt.transactionHash,
        });
        onSent(receipt.transactionHash); */
        console.log(receipt);
        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        const txUrl = `${fromChain.blockExplorerUrl}/tx/${txHash}`;
    }

    callDelist = async (itemId: number) => {
        if(!this.NFTMarketplace) {
            return;
        }

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

        // its item id (aka listed id), not token id ya
        const receipt = await this.NFTMarketplace
            .delistItem(
                itemId
            ).then((tx: any) => tx.wait());

        console.log(receipt);
        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        const txUrl = `${fromChain.blockExplorerUrl}/tx/${txHash}`;
    }

    callBuy = async (
        amount: string,
        itemId: number
    ) => {
        if(!this.NFTMarketplace || !this.IERC20 || !this.provider) {
            return;
        }

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
            .purchaseItem(
                itemId
            )
            .then((tx: any) => tx.wait());

        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        const txUrl = `${fromChain.blockExplorerUrl}/tx/${txHash}`;
    }

    // cross chain stuff
    crossChainList = async (toChainId: number, tokenId: number, price: string) => {
        if(!this.provider) {
            return;
        }

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
        const destNFT = this.getNFTContract(toChain);
        const contractName = await destNFT!.name();
        const nftNonce = await destNFT!.nonces(tokenId);

        const signature = await this.getSignature(contractName, toChain.oneNFT!, toChain.nftMarketplace!, tokenId, toChain.id, nftNonce, deadline);

        //switch back to current chain
        await requestSwitchChain(fromChain);
        const sourceContract = this.getMessageSenderContract(fromChain);

        // list for how long? (default 14 days)
        let currentTime = new Date();
        currentTime.setDate(currentTime.getDate()+14);
        const listExpiry = Math.round(currentTime.getTime() / 1000);

        const receipt = await sourceContract!
            .crossChainList(
                toChain.name,
                destContract!.address,
                toChain.oneNFT,
                tokenId,
                ethers.utils.parseUnits(price.toString(), 6),
                listExpiry,
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
    crossChainDelist = async (toChainId: number, itemId: number) => {
        if(!this.provider || !this.IERC20) {
            return;
        }

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

        const receipt = await sourceContract!
            .crossChainDelist(
                toChain.name,
                destContract!.address,
                itemId,
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
        itemId: number
    ) => {
        if(!this.provider || !this.IERC20) {
            return;
        }

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
        const tokenAddress = await srcGatewayContract!.tokenAddresses("aUSDC");


        const erc20 = new Contract(
            tokenAddress,
            this.IERC20.abi,
            this.provider.getSigner(),
        );

        // Approve the token for the amount to be sent
        await erc20
            .approve(sourceContract!.address, ethers.utils.parseUnits(amount, 6))
            .then((tx: any) => tx.wait());

        const receipt = await sourceContract!
            .crossChainBuy(
                toChain.name,
                destContract!.address,
                "aUSDC",
                ethers.utils.parseUnits(amount, 6),
                itemId,
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
        console.log(txUrl);
    }

    mint = async (toChainId: number, name: string, description: string, imageBlob: Blob) => {
        if(!this.provider || !this.oneNFT || !this.messageSender) {
            return;
        }

        if(!window.ethereum) {
            return;
        }

        //get chains
        const toChain = _.find(ChainConfigs, {
            id: Number(toChainId)
        });

        const fromChainId = Number(window.ethereum.networkVersion);
        const fromChain = _.find(ChainConfigs, {
            id: fromChainId
        });

        const content: any = await getBase64(imageBlob);

        let ipfsJSON: string;
        try {
            // prepare path data for ipfs "${chainName}/${randomHash}"
            const ipfsPath = `${toChain!.name}/${generateId()}`;
            // update to moralis
            const ipfsURL = await uploadToIPFS(ipfsPath, content);
            console.log(`img: ${ipfsURL}`);

            // create json metadata
            const jsonData = {
                "name": name,
                "creator": window.ethereum?.selectedAddress,
                "image": ipfsURL,
                "description": description
            };

            ipfsJSON = await uploadToIPFS(`metadata/${ipfsPath}`, jsonData);
            console.log(`json: ${ipfsJSON}`);
        }
        catch (error){
            console.error(error);
            alert('Error Uploading..');
            return;
        }

        //mint
        if (Number(toChainId) == fromChainId) {
            console.log(`Same chain tx`);
            // same chain mint

            const currChain = _.find(ChainConfigs, {
                id: fromChainId
            });

            const nftContract = this.oneNFT;
            const receipt = await nftContract.mint(ipfsJSON).then((tx: any) => tx.wait());

            const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
            console.log(`${currChain!.blockExplorerUrl}/tx/${txHash}`);
        }
        else {
            // cross chain mint
            // might not work yet

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
                    ipfsJSON,
                    {
                        value: BigInt(gasFee)
                    },
                )
                .then((tx: any) => tx.wait());;

            console.log(`https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`);
        }
    }

    // getContractNFTs = async() => {
    getContractNFTs = async(): Promise<HolderToken[]> => {
        if(!this.oneNFT) {
            return [];
        }

        const nftCount: number = Number(await this.oneNFT.getCurrentId());
        const tokenIds = Array(nftCount).fill(1).map((element, index) => index + 1);
        const tokenURLs = await this._batchGetTokenURI(tokenIds);
        const contractName = await this.oneNFT.name();

        const tokenHolders = await this.oneNFT.GetAllNftOwnerAddress();

        const result: HolderToken[] = [];
        _.map(tokenURLs, (uri, id) => {
            result.push({
                collection: contractName,
                nft: this.oneNFT!.address,
                tokenId: tokenIds[id],
                tokenURI: uri,
                holder: tokenHolders[id]
            })
        });

        return result;
    }

    getHolderNFTs = async(): Promise<HolderToken[]> => {
        if(!this.oneNFT) {
            return [];
        }

        let nftIds: any = await this.oneNFT.GetHolderNfts(window.ethereum?.selectedAddress);
        nftIds = _.filter(nftIds, (d: ListedToken) => {
            return (d).toString() != "0";
        });

        const tokenIds = _.map(nftIds, (d) => Number(d.toString()));
        const tokenURLs = await this._batchGetTokenURI(tokenIds);
        const contractName = await this.oneNFT.name();

        const result: HolderToken[] = [];
        _.map(tokenURLs, async(uri, tIndex) => {
            result.push({
                collection: contractName,
                nft: this.oneNFT!.address,
                tokenId: tokenIds[tIndex],
                tokenURI: uri,
                holder: window.ethereum?.selectedAddress!
            })
        });

        return result;
    }

    getAllNFTs = async(): Promise<ListedToken[]> => {
        if(!this.provider || !this.NFTMarketplace) {
            return [];
        }
        let data: ListedToken[] = await this.NFTMarketplace.getAllListedNFTs();
        data = _.filter(data, (d: ListedToken) => {
            return (d.tokenId).toString() != "0";
        });

        const tokenIds = _.map(data, (d) => Number(d.tokenId.toString()));
        const itemIds = _.map(data, (d) => Number(d.itemId.toString()));
        const tokenURLs = await this._batchGetTokenURI(tokenIds);
        const sellingPrices = await this._batchGetSellingPrice(itemIds);

        const result: ListedToken[] = [];
        _.map(tokenURLs, (uri, tIndex) => {
            result.push({
                ...data[tIndex],
                tokenURI: uri
            })
            result[tIndex].sellingPrice = sellingPrices[tIndex];
        })
        return result;
    }

    // use as helper function
    _batchGetTokenURI = async(tokenIds: number[]): Promise<string[]> => {
        if(!this.batchOneNFT) {
            return [];
        }

        let promises: any = [];
        _.map(tokenIds, (d) => {
            // Queue some new things...
            promises.push(this.batchOneNFT!.tokenURI(d));
            // This line won't complete until the 10 above calls are complete, all of which will be sent as a single batch
        })
        const tokenURLs = await Promise.all(promises);
        return tokenURLs;
    }

    // use as helper function
    _batchGetSellingPrice = async(itemIds: number[]): Promise<BigNumber[]> => {
        if(!this.batchNFTMarketplace) {
            return [];
        }

        let promises: any = [];
        _.map(itemIds, (d) => {
            // Queue some new things...
            promises.push(this.batchNFTMarketplace!.getTotalPrice(d));
            // This line won't complete until the 10 above calls are complete, all of which will be sent as a single batch
        })
        const prices = await Promise.all(promises);
        return prices;
    }
}
