// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import DualClassWrapper from '../../../../duo-contract-wrapper/src/DualClassWrapper';
import Web3Wrapper from '../../../../duo-contract-wrapper/src/Web3Wrapper';
import * as CST from './constants';

let infura = {
	token: ''
};
try {
	infura = require('../../../../israfel-relayer/src/keys/infura.json');
} catch (error) {
	console.log(error);
}
const provider =
	(__ENV__ === CST.DB_LIVE ? CST.PROVIDER_INFURA_MAIN : CST.PROVIDER_INFURA_KOVAN) +
	'/' +
	infura.token;
export const duoWeb3Wrapper = new Web3Wrapper(window, '', provider, __ENV__ === CST.DB_LIVE);
export const dualClassWrappers: { [custodian: string]: DualClassWrapper } = {};
export const getDualClassWrapper = (custodian: string) => {
	if (!dualClassWrappers[custodian])
		dualClassWrappers[custodian] = new DualClassWrapper(duoWeb3Wrapper, custodian);
	return dualClassWrappers[custodian];
};
