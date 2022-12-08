import EVMConnector from './Connector';
import EVMSwitcher from './Switcher';
import * as ChainConfigs from './ChainConfigs';
import * as ContractCall from './ContractCall';

const SupportedChains = [
    ChainConfigs.BSC_TEST,
    ChainConfigs.AVAX_TEST,
    ChainConfigs.MUMBAI
]

export { EVMConnector, EVMSwitcher, ChainConfigs, ContractCall, SupportedChains };