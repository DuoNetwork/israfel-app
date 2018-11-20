import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IUserOrder,
	VoidThunkAction
} from 'ts/common/types';
import util from 'ts/common/util';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';

export function userOrderUpdate(userOrder: IUserOrder) {
	return {
		type: CST.AC_USER_ORDER,
		value: userOrder
	};
}

export function userOrdersUpdate(userOrders: IUserOrder[]) {
	return {
		type: CST.AC_USER_ORDER,
		value: userOrders
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
		type: CST.AC_ORDER_BOOK,
		value: obUpdate
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
