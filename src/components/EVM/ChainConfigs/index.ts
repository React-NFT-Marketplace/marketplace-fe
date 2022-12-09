import { ChainConfig } from "./types";
import { EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";

// chains
export const BSCTEST: ChainConfig = {
    "name": "BscTest",
    "id": 97,
    "rpc": "https://data-seed-prebsc-1-s3.binance.org:8545",
    "gateway": "0x4D147dCb984e6affEEC47e44293DA442580A3Ec0",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "BNB",
    "tokenSymbol": "BNB",
    "evmChain": EvmChain.BINANCE,
    "gasToken": GasToken.BINANCE,
    "nativeCurrency": {
        name: 'BNB',
        decimals: 18,
        symbol: 'BNB',
    },
    "blockExplorerUrl": 'https://testnet.bscscan.com',
    "crossChainToken": "0xc2fA98faB811B785b81c64Ac875b31CC9E40F9D2",
    "messageSender": "0x417b2CddBe4b1DEFa1890379013478De69e01BF8",
    "messageReceiver": "0xE1008caB93DF9c6363F0A7fE5dEe2b19cd8639bB",
    "nftMarketplace": "0xE248f962B754E8d645a963Fc4577279466990Ab2",
    "oneNFT": "0xbE90e0B447DaaF661fc8C18423a33796D4e9B22e"
};

export const AVAXTEST: ChainConfig = {
    "name": "Avalanche",
    "id": 43113,
    "rpc": "https://avalanchetestapi.terminet.io/ext/bc/C/rpc",
    "gateway": "0xC249632c2D40b9001FE907806902f63038B737Ab",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "Avax",
    "tokenSymbol": "AVAX",
    "evmChain": EvmChain.AVALANCHE,
    "gasToken": GasToken.AVAX,
    "nativeCurrency": {
        name: 'AVAX',
        decimals: 18,
        symbol: 'AVAX',
    },
    "blockExplorerUrl": 'https://testnet.snowtrace.io/',
    "crossChainToken": "0x57F1c63497AEe0bE305B8852b354CEc793da43bB",
    "messageSender": "0x588cEEefc28Fb8BB2538327140029b7622c92ef2",
    "messageReceiver": "0x94C112309898651C905cb94684431724012b4bF9",
    "nftMarketplace": "0xd33F1FAD44CB692f182F05b4Df0D34d242289ad4",
    "oneNFT": "0xEE86f5288369286E27667A2B0D3A72c978fbEf33"
};

export const MUMBAI: ChainConfig = {
    "name": 'Polygon',
    "id": 80001,
    "rpc": 'https://rpc-mumbai.maticvigil.com/',
    "gateway": "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "MATIC",
    "tokenSymbol": "MATIC",
    "evmChain": EvmChain.POLYGON,
    "gasToken": GasToken.MATIC,
    "nativeCurrency": {
        name: 'MATIC',
        decimals: 18,
        symbol: 'MATIC',
    },
    "blockExplorerUrl": 'https://mumbai.polygonscan.com',
    "crossChainToken": "0x2c852e740B62308c46DD29B982FBb650D063Bd07",
    "messageSender": "0x86686eD11ccf0bF3028d60fA96F65E17388bebeb",
    "messageReceiver": "0xd8784A3D7D8E727629Ca991A14024de8488dcE94",
    "nftMarketplace": "0xb7A7903ae0e63A9962f7C3F0690F942aa44186eb",
    "oneNFT": "0xfB61B7E690D41f396e780d4100A177714a87d8a2"
};

export const FANTOMTEST: ChainConfig = {
    "name": "Fantom",
    "id": 4002,
    "rpc": "https://rpc.ankr.com/fantom_testnet",
    "gateway": "0x97837985Ec0494E7b9C71f5D3f9250188477ae14",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "FTM",
    "tokenSymbol": "FTM",
    "evmChain": EvmChain.FANTOM,
    "gasToken": GasToken.FTM,
    "nativeCurrency": {
        name: 'FTM',
        decimals: 18,
        symbol: 'FTM',
    },
    "blockExplorerUrl": "https://testnet.ftmscan.com",
    "crossChainToken": "0x75Cc4fDf1ee3E781C1A3Ee9151D5c6Ce34Cf5C61",
    "messageSender": "0x1d24F83b0Bfe97E4671c7c607aB8d6A525C7E6eB",
    "messageReceiver": "0xC32f4a4d20fA6e745337E025bD70Cb401DafE09F",
    "nftMarketplace": "0x21Bb07a174b6e008356419a4fdb21E72C0788421",
    "oneNFT": "0x8569B4615023907D75197DBD4C71602FdFA0217a",
}

export const MOONBASE: ChainConfig = {
    "name": "Moonbeam",
    "id": 1287,
    "gateway": "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    "rpc": "https://moonbase-alpha.public.blastapi.io",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "DEV",
    "tokenSymbol": "DEV",
    "evmChain": EvmChain.MOONBEAM,
    "gasToken": GasToken.GLMR,
    "nativeCurrency": {
        name: 'DEV',
        decimals: 18,
        symbol: 'DEV',
    },
    "crossChainToken": "0xD1633F7Fb3d716643125d6415d4177bC36b7186b",
    "messageSender": "0xd7835B7293B2cd961f731c826A9fC373702b9214",
    "messageReceiver": "0x7D0C58f60c5463622529d65398Da53De206E1B5E",
    "nftMarketplace": "0x4002e80a26fbD42d689bE211eC7660Ef6B408d25",
    "oneNFT": "0x9B99E3731958F5c90Ad79A5b0540707F48955e3f"
}