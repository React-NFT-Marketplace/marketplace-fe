import { ethers, Contract } from 'ethers';
import { ChainConfigs } from '..';
import MessageSender from '../../../ABI/MessageSender.json';
import MessageReceiver from '../../../ABI/MessageReceiver.json';
import OneNFT from '../../../ABI/OneNFT.json';
import NFTMarketplace from '../../../ABI/NFTMarketplaceV2.json';
import IAxelarGateway from '../../../ABI/IAxelarGateway.json';
import IERC20 from '../../../ABI/IERC20.json';
import _ from 'lodash';
import { getBaseUrl, ucFirst } from '../../../common/utils';
import { ChainConfig } from '../ChainConfigs/types';
// import { BSC_TEST, POLYGON_TEST, BSC, POLYGON } from '../../../src/components/EVM/ChainConfigs';
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';
import { Transaction } from './types';
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

    constructor(chainId: number) {
        // get chain nft contract address
        const chain: ChainConfig | undefined = _.find(chains, { chainId });

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
}
