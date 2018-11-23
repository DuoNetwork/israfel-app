import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	ITokenBalance,
	IUserOrder,
	VoidThunkAction
} from 'ts/common/types';
import util from 'ts/common/util';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';

export function userOrderUpdate(userOrder: IUserOrder) {
	return {
		type: CST.AC_USER_ORDER,
		value: userOrder
	};
}

export function userOrderListUpdate(userOrders: IUserOrder[]) {
	return {
		type: CST.AC_USER_ORDER_LIST,
		value: userOrders
	};
}

export function orderBookUpdate(obUpdate: IOrderBookSnapshotUpdate) {
	return {
		type: CST.AC_OB_UPDATE,
		value: obUpdate
	};
}

export function orderBookSubscriptionUpdate(pair: string) {
	return {
		type: CST.AC_OB_SUB,
		value: pair
	};
}

export function getUserOrders(pair: string): VoidThunkAction {
	return async (dispatch, getState) => {
		const account = getState().web3.account;
		if (account !== CST.DUMMY_ADDR) {
			const now = util.getUTCNowTimestamp();
			dispatch(
				userOrderListUpdate(
					await dynamoUtil.getUserOrders(account, now - 30 * 86400000, now, pair)
				)
			);
		}
	};
}

export function tokenBalanceUpdate(balance: ITokenBalance) {
	return {
		type: CST.AC_TOKEN_BALANCE,
		value: balance
	};
}

export function getTokenBalance(pair: string): VoidThunkAction {
	return async (dispatch, getState) => {
		const account = getState().web3.account;
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

export function subscribe(pair: string): VoidThunkAction {
	return dispatch => {
		dispatch(orderBookSubscriptionUpdate(''));
		dispatch(userSubscriptionUpdate(0));
		dispatch(getUserOrders(pair));
		dispatch(getTokenBalance(pair));
		dispatch(orderBookSubscriptionUpdate(pair));
		wsUtil.subscribeOrderBook(pair);
		dispatch(
			userSubscriptionUpdate(
				window.setInterval(() => {
					dispatch(getTokenBalance(pair));
					dispatch(getUserOrders(pair));
				}, 30000)
			)
		);
	};
}
