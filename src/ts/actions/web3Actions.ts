import * as CST from '../common/constants';
import { VoidThunkAction } from '../common/types';
import web3Util from '../common/web3Util';

export function accountUpdate(account: string) {
	return {
		type: CST.AC_ACCOUNT,
		value: account
	};
}

export function getAccount(): VoidThunkAction {
	return async dispatch => {
		const account = await web3Util.getCurrentAddress();
		if (account) dispatch(accountUpdate(account));
	};
}

export function networkUpdate(networkId: number) {
	return {
		type: CST.AC_NETWORK,
		value: networkId
	};
}

export function getNetwork(): VoidThunkAction {
	return async dispatch => dispatch(networkUpdate(await web3Util.getCurrentNetwork()));
}

// export function gasPriceUpdate(gasPrice: number) {
// 	return {
// 		type: CST.AC_GAS_PX,
// 		value: gasPrice
// 	};
// }

// export function getGasPrice(): VoidThunkAction {
// 	return async dispatch => dispatch(gasPriceUpdate(await web3Util.getGasPrice()));
// }

export function refresh(): VoidThunkAction {
	return dispatch => {
		dispatch(getAccount());
		// dispatch(getGasPrice());
		dispatch(getNetwork());
	};
}
