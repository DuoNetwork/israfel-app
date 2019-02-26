import { DualClassWrapper, VivaldiWrapper, Web3Wrapper } from '@finbook/duo-contract-wrapper';
import { Constants } from '@finbook/israfel-common';

export const duoWeb3Wrapper = new Web3Wrapper(
	window,
	__ENV__ === Constants.DB_LIVE
		? Constants.PROVIDER_INFURA_MAIN
		: Constants.PROVIDER_INFURA_KOVAN,
	'',
	__ENV__ === Constants.DB_LIVE
);
export const custodianWrappers: { [custodian: string]: DualClassWrapper | VivaldiWrapper } = {};
export const isVivaldiCustodian = (custodian: string) => {
	for (const tenor in duoWeb3Wrapper.contractAddresses.Custodians.Vivaldi) {
		const addr = duoWeb3Wrapper.contractAddresses.Custodians.Vivaldi[tenor];
		if (addr.custodian.address.toLowerCase() === custodian) return true;
	}

	return false;
};

export const getCustodianWrapper = (custodian: string) => {
	if (!custodianWrappers[custodian])
		custodianWrappers[custodian] = isVivaldiCustodian(custodian)
			? new VivaldiWrapper(duoWeb3Wrapper, custodian)
			: new DualClassWrapper(duoWeb3Wrapper, custodian);
	return custodianWrappers[custodian];
};

export const getTokensPerEth = DualClassWrapper.getTokensPerEth;
export const getTokenInterestOrLeverage = DualClassWrapper.getTokenInterestOrLeverage;
