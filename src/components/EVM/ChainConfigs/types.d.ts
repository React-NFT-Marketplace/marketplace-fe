export type ChainConfig = {
    name: string;
    shortName: string;
    chainId: number;
    evmChain?: string;
    rpc: string;
    nativeCurrency: {
        name: string;
        decimals: number;
        symbol: string;
    };
    blockExplorerUrl?: string;
    gateway?: string;
    gasReceiver?: string;
    oneNFT?: string;
    tokenName?: string;
    tokenSymbol?: string;
    crossChainToken?: string;
    messageReceiver?: string;
    messageSender?: string;
    nftMarketplace?: string;
}