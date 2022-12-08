import { ChainConfig } from "./types";

// chains
export const BSC_TEST: ChainConfig = {
    "name": "BscTest",
    shortName: "BscTest",
    "id": 97,
    "gateway": "0x4D147dCb984e6affEEC47e44293DA442580A3Ec0",
    "rpc": "https://data-seed-prebsc-1-s3.binance.org:8545",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "BNB",
    "tokenSymbol": "BNB",
    nativeCurrency: {
        name: 'BNB',
        decimals: 18,
        symbol: 'BNB',
    },
    "crossChainToken": "0xc2fA98faB811B785b81c64Ac875b31CC9E40F9D2",
    "messageSender": "0xD31F23025d9349bDF5b3b1D354ec934334a58f65",
    "messageReceiver": "0xbf8F911C287E70784c1A80D3bFa047D1036D4d3f",
    "nftMarketplace": "0xcFa0c704F650d696A18ED404f24e236ad4B8eE9b",
    "oneNFT": "0x0bD341f2783e3D2fDfaf9C46D45f0de57FEAeF39"
};

export const AVAX_TEST: ChainConfig = {
    "name": "Avalanche",
    shortName: "Avalanche",
    "id": 43113,
    "rpc": "https://avalanchetestapi.terminet.io/ext/bc/C/rpc",
    "gateway": "0xC249632c2D40b9001FE907806902f63038B737Ab",
    "gasReceiver": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "tokenName": "Avax",
    "tokenSymbol": "AVAX",
    nativeCurrency: {
        name: 'AVAX',
        decimals: 18,
        symbol: 'AVAX',
    },
    "crossChainToken": "0x57F1c63497AEe0bE305B8852b354CEc793da43bB",
    "messageSender": "0x6E6057c005Fa7379Fb8907c1c0509Ef5E2ACc6Ad",
    "messageReceiver": "0xc1a91705Cd4B6e9985e9875c7c1d75B45C89BB53",
    "nftMarketplace": "0xccD1a7454D044601Fb0C193576A10C5e25651b23",
    "oneNFT": "0x4454140E52Aa1F3E47b188cA0d96440020717BDb"
};

export const MUMBAI: ChainConfig = {
    name: 'Polygon',
    shortName: 'MUMBAI',
    evmChain: "polygon",
    id: 80001,
    // rpc: 'https://rpc-mumbai.matic.today/',
    // rpc: 'https://polygontestapi.terminet.io/rpc',
    rpc: 'https://rpc-mumbai.maticvigil.com/',
    nativeCurrency: {
        name: 'MATIC',
        decimals: 18,
        symbol: 'MATIC',
    },
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    crossChainToken: '0x2c852e740B62308c46DD29B982FBb650D063Bd07',
};