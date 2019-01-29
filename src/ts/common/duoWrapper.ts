// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import DualClassWrapper from '../../../../duo-contract-wrapper/src/DualClassWrapper';
import Web3Wrapper from '../../../../duo-contract-wrapper/src/Web3Wrapper';
import * as CST from './constants';

export const duoWeb3Wrapper = new Web3Wrapper(
	window,
	__ENV__ === CST.DB_LIVE ? CST.PROVIDER_INFURA_MAIN : CST.PROVIDER_INFURA_KOVAN,
	'',
	__ENV__ === CST.DB_LIVE
);
export const dualClassWrappers: { [custodian: string]: DualClassWrapper } = {};
export const getDualClassWrapper = (custodian: string) => {
	if (!dualClassWrappers[custodian])
		dualClassWrappers[custodian] = new DualClassWrapper(duoWeb3Wrapper, custodian);
	return dualClassWrappers[custodian];
};

export const getTokensPerEth = DualClassWrapper.getTokensPerEth;
export const getTokenInterestOrLeverage = DualClassWrapper.getTokenInterestOrLeverage;
