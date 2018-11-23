import * as CST from 'ts/common/constants';
import { IEthBalance, VoidThunkAction } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';

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

export function ethBalanceUpdate(balance: IEthBalance) {
	return {
		type: CST.AC_ETH_BALANCE,
		value: balance
	};
}

export function getBalance(): VoidThunkAction {
	return async (dispatch, getState) => {
		const account = getState().web3.account;
		dispatch(
			ethBalanceUpdate({
				eth: await web3Util.getEthBalance(account),
				weth: await web3Util.getTokenBalance(CST.TOKEN_WETH, account)
			})
		);
	};
}

export function refresh(): VoidThunkAction {
	return async dispatch => {
		dispatch(getNetwork());
		await dispatch(getAccount());
		dispatch(getBalance());
	};
}
