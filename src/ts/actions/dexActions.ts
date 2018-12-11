import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	// IUserOrder,
	VoidThunkAction
} from 'ts/common/types';
import wsUtil from 'ts/common/wsUtil';

// export function orderUpdate(order: IUserOrder) {
// 	return {
// 		type: CST.AC_ORDER,
// 		value: order
// 	};
// }

// export function orderHistoryUpdate(orderHistory: IUserOrder[]) {
// 	return {
// 		type: CST.AC_ORDER_HISTORY,
// 		value: orderHistory
// 	};
// }

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

export function orderBookSnapshotUpdate(orderBook: IOrderBookSnapshot) {
	return {
		type: CST.AC_OB_SNAPSHOT,
		value: orderBook
	};
}

export function subscribe(account: string, pair: string): VoidThunkAction {
	return dispatch => {
		dispatch(orderBookSubscriptionUpdate(account, ''));
		dispatch(orderBookSubscriptionUpdate(account, pair));
		wsUtil.subscribeOrderBook(pair);
		// if (account !== CST.DUMMY_ADDR) wsUtil.subscribeOrderHistory(account, pair);
	};
}
