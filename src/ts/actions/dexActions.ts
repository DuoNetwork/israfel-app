import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IUserOrder,
	VoidThunkAction
} from 'ts/common/types';
import util from 'ts/common/util';
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

export function userOrderSubscriptionUpdate(intervalId: number) {
	return {
		type: CST.AC_UO_SUB,
		value: intervalId
	};
}

export function orderBookSnapshotUpdate(orderBook: IOrderBookSnapshot) {
	return {
		type: CST.AC_OB_SNAPSHOT,
		value: orderBook
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

export function subscribe(pair: string): VoidThunkAction {
	return dispatch => {
		dispatch(orderBookSubscriptionUpdate(''));
		dispatch(userOrderSubscriptionUpdate(0));
		dispatch(getUserOrders(pair));
		dispatch(orderBookSubscriptionUpdate(pair));
		wsUtil.subscribeOrderBook(pair);
		dispatch(
			userOrderSubscriptionUpdate(
				window.setInterval(() => dispatch(getUserOrders(pair)), 60000)
			)
		);
	};
}
