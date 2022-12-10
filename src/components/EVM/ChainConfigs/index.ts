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
    "blockExplorerApi": "https://api-testnet.bscscan.com",
    "crossChainToken": "0xc2fA98faB811B785b81c64Ac875b31CC9E40F9D2",
    "messageSender": "0xa75Ad3B5fb1FB0639f9083726383E2F3aC2464BD",
    "messageReceiver": "0x50e32BD81954241a2D254F90B6af5Aab820A4330",
    "nftMarketplace": "0xCC71B9e2A627872bEeca4dF6ca2507C4DF195f90",
    "oneNFT": "0x8424Af22ac25395Fc388529fC4587DE825febB40"
};

export const AVAXTEST: ChainConfig = {
    "name": "Avalanche",
    "id": 43113,
    "rpc": "https://api.avax-test.network/ext/bc/C/rpc",
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
    "blockExplorerUrl": 'https://testnet.snowtrace.io',
    "blockExplorerApi": "https://api-testnet.snowtrace.io",
    "crossChainToken": "0x57F1c63497AEe0bE305B8852b354CEc793da43bB",
    "messageSender": "0x9a3eeeF0D1b815131Ef71c2F1f1F9cfD8cd2D873",
    "messageReceiver": "0xdb3b76f2A79A248E1AA8B9A882983Ca3a89F4165",
    "nftMarketplace": "0xbe5529E24092bE8D20E658564E06EeB2a9467CD8",
    "oneNFT": "0x1E977f94Deb83Db6653e69E0ad8bC7758e38E55C"
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
    "blockExplorerApi": 'https://api-testnet.polygonscan.com',
    "crossChainToken": "0x2c852e740B62308c46DD29B982FBb650D063Bd07",
    "messageSender": "0x2A128FbFE5635Ea9f27BE37f15baAf633bF90C1d",
    "messageReceiver": "0x45E868b8d68e69D74A853AecFED6dcB2105f7a43",
    "nftMarketplace": "0xD0eef65aE211fd3BBC43e5CC36ce34cd611a3135",
    "oneNFT": "0x06eDF7BD0eCe3D0AC827bE68471e3f39a2EF85f5"
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
    "blockExplorerApi": "https://api-testnet.ftmscan.com",
    "crossChainToken": "0x75Cc4fDf1ee3E781C1A3Ee9151D5c6Ce34Cf5C61",
    "messageSender": "0x95aa988924a83fe21872EE678a2Cb911A3DAca04",
    "messageReceiver": "0x5a46534bCF2FA56DF361Dd79F92Ced11021A949C",
    "nftMarketplace": "0xCdb88921EBE7779AB858c370Fc5021bD08bF5f00",
    "oneNFT": "0x6D0DA9F3f30b046AAc64E43A4B3d59604080aE9a"
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
    "gasToken": "DEV",
    "nativeCurrency": {
        name: 'DEV',
        decimals: 18,
        symbol: 'DEV',
    },
    "blockExplorerUrl": "https://moonbase.moonscan.io",
    "blockExplorerApi": "https://api-moonbase.moonscan.io",
    "crossChainToken": "0xD1633F7Fb3d716643125d6415d4177bC36b7186b",
    "messageSender": "0x7f982200114deAa4cEAb0Fc44E8F8b3CB9944D16",
    "messageReceiver": "0xB050D6cf917d2ac5211eD48F584e3DcC159a4D5F",
    "nftMarketplace": "0x8dce04da0C5D54298a4c4B0e9d5B7372D9a75AdE",
    "oneNFT": "0x37e1036491d8bF7A14CD18174170f779fdC5BEC7"
}