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
    chainConfig?: ChainConfig;

    constructor(chainId: number | null = null) {
        // get chain nft contract address
        const chain: ChainConfig | undefined = _.find(chains, { id: (chainId? Number(chainId) : Number(window.ethereum!.networkVersion)) });
        this.chainConfig = chain;
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

        //get new signer
        const provider = this.getProvider();
        const signer = provider.getSigner();

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

    getProvider = (isRpc: boolean = false, chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        return isRpc? new ethers.providers.JsonRpcProvider(chain.rpc) : new ethers.providers.Web3Provider(window.ethereum as any);
    }

    getGatewayContract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider();
        return new Contract(chain.gateway!, IAxelarGateway.abi, provider.getSigner());
    }

    getOneNFTContract = (isRpc: boolean = false, chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider(isRpc);
        return new Contract(chain.oneNFT!, OneNFT.abi, isRpc? provider : provider.getSigner());
    }

    getMessageSenderContract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider();
        return new Contract(chain.messageSender!, MessageSender.abi, provider.getSigner());
    }

    getMessageReceiverContract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider();
        return new Contract(chain.messageReceiver!, MessageReceiver.abi, provider.getSigner());
    }

    getMarketplaceContract = (isRpc: boolean = false, chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider(isRpc);
        return new Contract(chain.nftMarketplace!, NFTMarketplace.abi, isRpc? provider : provider.getSigner());
    }

    getAUSDCContract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider();
        return new Contract(chain.crossChainToken!, aUSDC.abi, provider.getSigner());
    }

    getIERC20Contract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider();
        return new Contract(chain.crossChainToken!, IERC20.abi, provider.getSigner());
    }

    getBatchNFTMarketplaceContract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider(true);
        return new Contract(chain.nftMarketplace!, NFTMarketplace.abi, provider);
    }

    getBatchOneNFTContract = (chain?: ChainConfig) => {
        chain = chain ?? this.chainConfig!;
        const provider = this.getProvider(true);
        return new Contract(chain.oneNFT!, OneNFT.abi, provider);
    }

    getWalletUSDCBal = async () => {
        if(!this.chainConfig) {
            return 0;
        }
        const balance = await this.getAUSDCContract().balanceOf(window.ethereum!.selectedAddress);
        const tokenDecimal = 6;
        // to align some token that are not 18 decimals (ecc, eifi)
        let decimalPad = (18 - tokenDecimal);
        decimalPad = (decimalPad == 0) ? 1 : Number(10) ** decimalPad;


        return ethers.utils.formatEther(balance.mul(decimalPad));
    }

    callList = async (tokenId: number, price: number) => {
        if(!this.chainConfig) {
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
        const oneNFT = this.getOneNFTContract();
        const contractName = await oneNFT.name();
        const nftNonce = await oneNFT.nonces(tokenId);

        // await marketplaceContract.approve(marketplaceContract.address, tokenId);

        // gasless call
        const signature = await this.getSignature(contractName, fromChain.oneNFT!, fromChain.nftMarketplace!, tokenId, fromChain.id, nftNonce, deadline);
        // console.log(`here ${signature}`);

        // list for how long? (default 14 days)
        let currentTime = new Date();
        currentTime.setDate(currentTime.getDate()+14);
        const listExpiry = Math.round(currentTime.getTime() / 1000);

        // gasless call
        const NFTMarketplace = this.getMarketplaceContract();
        const receipt = await(await NFTMarketplace.makeItem(fromChain.oneNFT, tokenId, ethers.utils.parseUnits(price.toString(), 6), listExpiry, deadline, signature)).wait(1);

        // const receipt = await marketplaceContract.setListToken(tokenId, window.ethers.utils.parseUnits(price.toString(), 6));


        /* console.log({
          txHash: receipt.transactionHash,
        });
        onSent(receipt.transactionHash); */
        console.log(receipt);
        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        return `${fromChain.blockExplorerUrl}/tx/${txHash}`;
    }

    callDelist = async (itemId: number) => {
        if(!this.chainConfig) {
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
        const NFTMarketplace = this.getMarketplaceContract();
        const receipt = await NFTMarketplace
            .delistItem(
                itemId
            ).then((tx: any) => tx.wait());

        console.log(receipt);
        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        return `${fromChain.blockExplorerUrl}/tx/${txHash}`;
    }

    callBuy = async (
        amount: number,
        itemId: number
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
        const NFTMarketplace = this.getMarketplaceContract();
        const erc20 = this.getAUSDCContract();

        // Approve the token for the amount to be sent
        await erc20
            .approve(NFTMarketplace.address, ethers.utils.parseUnits(amount.toString(), 6))
            .then((tx: any) => tx.wait());

        const receipt = await NFTMarketplace
            .purchaseItem(
                itemId
            )
            .then((tx: any) => tx.wait());

        const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
        return `${fromChain.blockExplorerUrl}/tx/${txHash}`;
    }

    // cross chain stuff
    crossChainList = async (toChainId: number, tokenId: number, price: number) => {
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
        const destMarketplace = this.getMarketplaceContract(false, toChain);
        const destContract = this.getMessageReceiverContract(toChain);
        const destNFT = this.getOneNFTContract(false, toChain);
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
        return `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;
    }

    // cross chain delist
    crossChainDelist = async (toChainId: number, itemId: number) => {
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

        return`https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;
    }

    crossChainBuy = async (
        toChainId: number,
        amount: number,
        itemId: number
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

        const sourceContract = this.getMessageSenderContract(fromChain);
        const destContract = this.getMessageReceiverContract(toChain);

        // Get token address from the gateway contract
        const erc20 = this.getAUSDCContract();

        // Approve the token for the amount to be sent
        await erc20
            .approve(sourceContract!.address, ethers.utils.parseUnits(amount.toString(), 6))
            .then((tx: any) => tx.wait());

        const receipt = await sourceContract!
            .crossChainBuy(
                toChain.name,
                destContract!.address,
                "aUSDC",
                ethers.utils.parseUnits(amount.toString(), 6),
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

        return `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;
    }

    list = async(toChainId: number, tokenId: number, price: number) => {
        if(!window.ethereum) {
            return;
        }

        const fromChainId = Number(window.ethereum.networkVersion);

        if(fromChainId != toChainId) {
            return await this.crossChainList(toChainId, tokenId, price);
        }

        else {
            return await this.callList(tokenId, price);
        }
    }

    delist = async(toChainId: number, itemId: number) => {
        if(!window.ethereum) {
            return;
        }

        const fromChainId = Number(window.ethereum.networkVersion);

        if(fromChainId != toChainId) {
            return await this.crossChainDelist(toChainId, itemId);
        }

        else {
            return await this.callDelist(itemId);
        }
    }

    buy = async(toChainId: number, amount: number, itemId: number) => {
        if(!window.ethereum) {
            return;
        }

        const fromChainId = Number(window.ethereum.networkVersion);

        if(fromChainId != toChainId) {
            return await this.crossChainBuy(toChainId, amount, itemId);
        }

        else {
            return await this.callBuy(amount, itemId);
        }
    }

    mint = async (toChainId: number, name: string, description: string, imageBlob: Blob) => {
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

            const nftContract = this.getOneNFTContract();
            const receipt = await nftContract.mint(ipfsJSON).then((tx: any) => tx.wait());

            const txHash = _.has(receipt, 'transactionHash') ? receipt.transactionHash : receipt.hash;
            return `${currChain!.blockExplorerUrl}/tx/${txHash}`;
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

            const receipt = await this.getMessageSenderContract().crossChainMint(
                    uppercase(toChain!.evmChain!),
                    toChain!.messageReceiver,
                    toChain!.oneNFT,
                    ipfsJSON,
                    {
                        value: BigInt(gasFee)
                    },
                )
                .then((tx: any) => tx.wait());;
            console.log('here3')

            return `https://testnet.axelarscan.io/gmp/${receipt.transactionHash}`;
        }
    }

    // getContractNFTs = async() => {
    getContractNFTs = async(): Promise<HolderToken[]> => {
        const oneNFT = this.getOneNFTContract(true);
        const nftCount: number = Number(await oneNFT.getCurrentId());
        const tokenIds = Array(nftCount).fill(1).map((element, index) => index + 1);
        const tokenURLs = await this._batchGetTokenURI(tokenIds);
        const contractName = await oneNFT.name();

        const tokenHolders = await oneNFT.GetAllNftOwnerAddress();

        const result: HolderToken[] = [];
        _.map(tokenURLs, (uri, id) => {
            result.push({
                collection: contractName,
                nft: oneNFT.address,
                tokenId: tokenIds[id],
                tokenURI: uri,
                holder: tokenHolders[id]
            })
        });

        return result;
    }

    getHolderNFTs = async(): Promise<HolderToken[]> => {
        if(!window.ethereum) {
            return [];
        }

        const oneNFT = this.getOneNFTContract();
        let nftIds: any = await oneNFT.GetHolderNfts(window.ethereum?.selectedAddress);
        nftIds = _.filter(nftIds, (d: ListedToken) => {
            return (d).toString() != "0";
        });

        const tokenIds = _.map(nftIds, (d) => Number(d.toString()));
        const tokenURLs = await this._batchGetTokenURI(tokenIds);
        const contractName = await oneNFT.name();

        const result: HolderToken[] = [];
        _.map(tokenURLs, async(uri, tIndex) => {
            result.push({
                collection: contractName,
                nft: oneNFT.address,
                tokenId: tokenIds[tIndex],
                tokenURI: uri,
                holder: window.ethereum?.selectedAddress!
            })
        });

        return result;
    }

    getAllNFTs = async(): Promise<ListedToken[]> => {
        if(!window.ethereum) {
            return [];
        }

        const NFTMarketplace = this.getMarketplaceContract(true);
        let data: ListedToken[] = await NFTMarketplace.getAllListedNFTs();
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
        if(!window.ethereum) {
            return [];
        }

        const batchOneNFT = this.getBatchOneNFTContract();

        let promises: any = [];
        _.map(tokenIds, (d) => {
            // Queue some new things...
            promises.push(batchOneNFT!.tokenURI(d));
            // This line won't complete until the 10 above calls are complete, all of which will be sent as a single batch
        })
        const tokenURLs = await Promise.all(promises);
        return tokenURLs;
    }

    // use as helper function
    _batchGetSellingPrice = async(itemIds: number[]): Promise<BigNumber[]> => {
        if(!window.ethereum) {
            return [];
        }

        const batchNFTMarketplace = this.getBatchNFTMarketplaceContract();
        let promises: any = [];
        _.map(itemIds, (d) => {
            // Queue some new things...
            promises.push(batchNFTMarketplace.getTotalPrice(d));
            // This line won't complete until the 10 above calls are complete, all of which will be sent as a single batch
        })
        const prices = await Promise.all(promises);
        return prices;
    }
}
