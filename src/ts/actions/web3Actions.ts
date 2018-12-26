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

export function tokenBalanceUpdate(code: string, custodian: string, balance: ITokenBalance) {
	return {
		type: CST.AC_TOKEN_BALANCE,
		code: code,
		custodian: custodian,
		balance: balance
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

export function getCustodianBalances(): VoidThunkAction {
	return (dispatch, getState) => {
		const account = getState().web3.account;
		const tokens = getState().relayer.tokens;
		const processedCustodian: { [custodian: string]: boolean } = {};
		if (account !== CST.DUMMY_ADDR)
			Promise.all([
				web3Util.getEthBalance(account),
				web3Util.getTokenBalance(CST.TOKEN_WETH, account),
				web3Util.getProxyTokenAllowance(CST.TOKEN_WETH, account)
			]).then(result =>
				dispatch(
					ethBalanceUpdate({
						eth: result[0],
						weth: result[1],
						allowance: result[2]
					})
				)
			);

		for (const token of tokens) {
			if (!processedCustodian[token.custodian]) {
				const cw = getDualClassWrapper(token.custodian);
				if (cw)
					Promise.all([cw.getContractCode(), cw.getStates()]).then(result =>
						dispatch(custodianUpdate(token.custodian, result[0], result[1]))
					);
				processedCustodian[token.custodian] = true;
			}
			if (account !== CST.DUMMY_ADDR)
				Promise.all([
					web3Util.getTokenBalance(token.code, account),
					web3Util.getProxyTokenAllowance(token.code, account)
				]).then(result =>
					dispatch(
						tokenBalanceUpdate(token.code, token.custodian, {
							balance: result[0],
							allowance: result[1]
						})
					)
				);
		}
	};
}

export function refresh(): VoidThunkAction {
	return async dispatch => {
		dispatch(getNetwork());
		await dispatch(getAccount());
		dispatch(getCustodianBalances());
	};
}
