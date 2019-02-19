import { ICustodianStates } from '@finbook/duo-contract-wrapper';
import { Constants } from '@finbook/israfel-common';
import * as CST from 'ts/common/constants';
import { getCustodianWrapper } from 'ts/common/duoWrapper';
import { IEthBalance, ITokenBalance, VoidThunkAction } from 'ts/common/types';
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

export function custodianUpdate(custodian: string, code: string, states: ICustodianStates) {
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
		if (account !== Constants.DUMMY_ADDR)
			Promise.all([
				web3Util.getEthBalance(account),
				web3Util.getTokenBalance(Constants.TOKEN_WETH, account),
				web3Util.getTokenAllowance(Constants.TOKEN_WETH, account)
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
				const cw = getCustodianWrapper(token.custodian);
				if (cw)
					Promise.all([cw.getContractCode(), cw.getStates()] as any).then(result =>
						dispatch(
							custodianUpdate(token.custodian, result[0] as any, result[1] as any)
						)
					);
				processedCustodian[token.custodian] = true;
			}
			if (account !== Constants.DUMMY_ADDR)
				Promise.all([
					web3Util.getTokenBalance(token.code, account),
					web3Util.getTokenAllowance(token.code, account)
				])
					.then(result =>
						dispatch(
							tokenBalanceUpdate(token.code, token.custodian, {
								balance: result[0],
								allowance: result[1],
								address: token.address
							})
						)
					)
					.catch(async error => {
						console.log(token.code);
						console.log();
						console.log(web3Util.getTokenAddressFromCode(token.code));
						console.log(
							await web3Util.contractWrappers.erc20Token.getBalanceAsync(
								web3Util.getTokenAddressFromCode(token.code),
								account
							)
						);
						console.log(error);
					});
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
