import EVMConnector from './Connector';
import EVMSwitcher from './Switcher';
import * as ChainConfigs from './ChainConfigs';
import * as ContractCall from './ContractCall';

const SupportedChains = [
    ChainConfigs.BSCTEST,
    ChainConfigs.AVAXTEST,
    ChainConfigs.MUMBAI,
    ChainConfigs.FANTOMTEST,
    ChainConfigs.MOONBASE,
]

export { EVMConnector, EVMSwitcher, ChainConfigs, ContractCall, SupportedChains };