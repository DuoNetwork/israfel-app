import DualClassWrapper from '../../../../duo-contract-wrapper/src/DualClassWrapper';
import Web3Wrapper from '../../../../duo-contract-wrapper/src/Web3Wrapper';
import infura from '../../../../israfel-relayer/src/keys/infura.json';
import * as CST from './constants';

const provider =
	(__KOVAN__ ? CST.PROVIDER_INFURA_KOVAN : CST.PROVIDER_INFURA_MAIN) + '/' + infura.token;
const duoWeb3Wrapper = new Web3Wrapper(window, '', provider, !__KOVAN__);
export const dualClassWrappers: { [custodian: string]: DualClassWrapper } = {};
export const getDualClassWrapper = (custodian: string) => {
	if (!dualClassWrappers[custodian])
		dualClassWrappers[custodian] = new DualClassWrapper(duoWeb3Wrapper, custodian);
	return dualClassWrappers[custodian];
};
