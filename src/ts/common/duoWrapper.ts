import { DualClassWrapper, Web3Wrapper } from '@finbook/duo-contract-wrapper';
import { Constants } from '@finbook/israfel-common';

export const duoWeb3Wrapper = new Web3Wrapper(
	window,
	__ENV__ === Constants.DB_LIVE
		? Constants.PROVIDER_INFURA_MAIN
		: Constants.PROVIDER_INFURA_KOVAN,
	'',
	__ENV__ === Constants.DB_LIVE
);
export const dualClassWrappers: { [custodian: string]: DualClassWrapper } = {};
export const getDualClassWrapper = (custodian: string) => {
	if (!dualClassWrappers[custodian])
		dualClassWrappers[custodian] = new DualClassWrapper(duoWeb3Wrapper, custodian);
	return dualClassWrappers[custodian];
};

export const getTokensPerEth = DualClassWrapper.getTokensPerEth;
export const getTokenInterestOrLeverage = DualClassWrapper.getTokenInterestOrLeverage;
