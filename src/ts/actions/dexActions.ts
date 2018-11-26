import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	ITokenBalance,
	IUserOrder,
	VoidThunkAction
} from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';

export function orderUpdate(order: IUserOrder) {
	return {
		type: CST.AC_ORDER,
		value: order
	};
}

export function orderHistoryUpdate(orderHistory: IUserOrder[]) {
	return {
		type: CST.AC_ORDER_HISTORY,
		value: orderHistory
	};
}

export function orderBookUpdate(obUpdate: IOrderBookSnapshotUpdate) {
	return {
		type: CST.AC_OB_UPDATE,
		value: obUpdate
	};
}

export function orderBookSubscriptionUpdate(account: string, pair: string) {
	return {
		type: CST.AC_OB_SUB,
		account: account,
		pair: pair
	};
}

export function tokenBalanceUpdate(balance: ITokenBalance) {
	return {
		type: CST.AC_TOKEN_BALANCE,
		value: balance
	};
}

export function getTokenBalance(account: string, pair: string): VoidThunkAction {
	return async dispatch => {
		const code = pair.split('|')[0];
		if (account !== CST.DUMMY_ADDR)
			dispatch(
				tokenBalanceUpdate({
					balance: await web3Util.getTokenBalance(code, account),
					allowance: await web3Util.getProxyTokenAllowance(code, account)
				})
			);
	};
}

export function orderBookSnapshotUpdate(orderBook: IOrderBookSnapshot) {
	return {
		type: CST.AC_OB_SNAPSHOT,
		value: orderBook
	};
}

export function userSubscriptionUpdate(intervalId: number) {
	return {
		type: CST.AC_USER_SUB,
		value: intervalId
	};
}

export function subscribe(account: string, pair: string): VoidThunkAction {
	return dispatch => {
		dispatch(orderBookSubscriptionUpdate(account, ''));
		dispatch(userSubscriptionUpdate(0));
		dispatch(getTokenBalance(account, pair));
		dispatch(orderBookSubscriptionUpdate(account, pair));
		wsUtil.subscribeOrderBook(pair);
		if (account !== CST.DUMMY_ADDR) wsUtil.subscribeOrderHistory(account, pair);
		dispatch(
			userSubscriptionUpdate(window.setInterval(() => dispatch(getTokenBalance(account, pair)), 30000))
		);
	};
}
