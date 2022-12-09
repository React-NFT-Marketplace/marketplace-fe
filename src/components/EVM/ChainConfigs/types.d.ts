import { EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";

export type ChainConfig = {
    name: string;
    id: number;
    evmChain?: EvmChain;
    rpc: string;
    nativeCurrency: {
        name: string;
        decimals: number;
        symbol: string;
    };
    blockExplorerUrl?: string;
    blockExplorerApi?: string;
    gateway?: string;
    gasReceiver?: string;
    gasToken?: GasToken;
    oneNFT?: string;
    tokenName?: string;
    tokenSymbol?: string;
    crossChainToken?: string;
    messageReceiver?: string;
    messageSender?: string;
    nftMarketplace?: string;
}