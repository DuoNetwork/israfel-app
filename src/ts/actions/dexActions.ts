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

export function userOrderUpdate(updateOrders: IUserOrder) {
	return {
		type: CST.AC_UPDATE_ORDERS,
		value: updateOrders
	};
}

export function userOrdersUpdate(userOrders: IUserOrder[]) {
	return {
		type: CST.AC_USER_ORDERS,
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

export function getUserOrders(): VoidThunkAction {
	return async (dispatch, getState) => {
		const account = getState().web3.account;
		if (account !== CST.DUMMY_ADDR)
			dispatch(
				userOrdersUpdate(
					await dynamoUtil.getUserOrders(
						account,
						util.getUTCNowTimestamp() - 30 * 86400000
					)
				)
			);
	};
}

export function refresh(): VoidThunkAction {
	return dispatch => {
		dispatch(getUserOrders());
	};
}

export function subscribeOrderBook(pair: string): VoidThunkAction {
	return dispatch => {
		dispatch(orderBookSubscriptionUpdate(''));
		dispatch(getUserOrders());
		dispatch(orderBookSubscriptionUpdate(pair));
		wsUtil.subscribeOrderBook(pair);
	};
}
