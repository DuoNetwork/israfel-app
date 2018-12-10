import DualClassWrapper from '../../../../duo-contract-wrapper/src/DualClassWrapper';
import Web3Wrapper from '../../../../duo-contract-wrapper/src/Web3Wrapper';
import infura from '../../../../israfel-relayer/src/keys/infura.json';
import * as CST from './constants';
import { ICustodianWrappers } from './types';

const provider =
	(__KOVAN__ ? CST.PROVIDER_INFURA_KOVAN : CST.PROVIDER_INFURA_MAIN) + '/' + infura.token;
export const duoWeb3Wrapper = new Web3Wrapper(window, '', provider, !__KOVAN__);
export const dualClassWrappers: ICustodianWrappers = {};
for (const type in duoWeb3Wrapper.contractAddresses.Custodians) {
	dualClassWrappers[type] = {};
	for (const tenor in duoWeb3Wrapper.contractAddresses.Custodians[type])
		dualClassWrappers[type][tenor] = new DualClassWrapper(
			duoWeb3Wrapper,
			duoWeb3Wrapper.contractAddresses.Custodians[type][tenor].custodian.address
		);
}

export const getDualClassWrapperByTypeTenor = (type: string, tenor: string) => {
	if (dualClassWrappers[type] && dualClassWrappers[type][tenor])
		return dualClassWrappers[type][tenor];
	return dualClassWrappers[CST.BEETHOVEN][CST.TENOR_PPT];
};

export const getDualClassAddressByTypeTenor = (type: string, tenor: string) => {
	if (duoWeb3Wrapper.contractAddresses.Custodians[type][tenor])
		return duoWeb3Wrapper.contractAddresses.Custodians[type][tenor];

	return duoWeb3Wrapper.contractAddresses.Custodians[CST.BEETHOVEN][CST.TENOR_PPT];
};
