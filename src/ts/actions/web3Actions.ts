import * as CST from 'ts/common/constants';
import { getDualClassWrapper } from 'ts/common/duoWrapper';
import { IDualClassStates, IEthBalance, ITokenBalance, VoidThunkAction } from 'ts/common/types';
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

export function tokenBalanceUpdate(code: string, balance: ITokenBalance) {
	return {
		type: CST.AC_TOKEN_BALANCE,
		code: code,
		balance: balance
	};
}

export function getBalances(): VoidThunkAction {
	return async (dispatch, getState) => {
		const account = getState().web3.account;
		const tokens = getState().ws.tokens;
		if (account !== CST.DUMMY_ADDR) {
			dispatch(
				ethBalanceUpdate({
					eth: await web3Util.getEthBalance(account),
					weth: await web3Util.getTokenBalance(CST.TOKEN_WETH, account),
					allowance: await web3Util.getProxyTokenAllowance(CST.TOKEN_WETH, account)
				})
			);
			for (const token of tokens)
				dispatch(
					tokenBalanceUpdate(token.code, {
						balance: await web3Util.getTokenBalance(token.code, account),
						allowance: await web3Util.getProxyTokenAllowance(token.code, account)
					})
				);
		}
	};
}

export function custodianUpdate(custodian: string, code: string, states: IDualClassStates) {
	return {
		type: CST.AC_CUSTODIAN,
		custodian: custodian,
		code: code,
		states: states
	};
}

export function getCustodians(): VoidThunkAction {
	return async (dispatch, getState) => {
		const tokens = getState().ws.tokens;
		const custodians: string[] = [];
		tokens.forEach(t => {
			if (!custodians.includes(t.custodian)) custodians.push(t.custodian);
		});
		for (const custodian of custodians) {
			const cw = getDualClassWrapper(custodian);
			if (cw)
				dispatch(
					custodianUpdate(custodian, await cw.getContractCode(), await cw.getStates())
				);
		}
	};
}

export function refresh(): VoidThunkAction {
	return async dispatch => {
		dispatch(getNetwork());
		await dispatch(getAccount());
		dispatch(getBalances());
		dispatch(getCustodians());
	};
}
