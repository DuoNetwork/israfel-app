import * as CST from 'ts/common/constants';
import relayerClient from 'ts/common/relayerClient';
import {
	IAcceptedPrice,
	INotification,
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IPrice,
	IStatus,
	IToken,
	IUserOrder,
	VoidThunkAction
} from 'ts/common/types';

export function connectionUpdate(connected: boolean) {
	return {
		type: CST.AC_CONNECTION,
		value: connected
	};
}

export function infoUpdate(
	tokens: IToken[],
	status: IStatus[],
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] },
	exchangePrices: { [source: string]: IPrice[] }
) {
	return {
		type: CST.AC_INFO,
		tokens: tokens,
		status: status,
		acceptedPrices: acceptedPrices,
		exchangePrices: exchangePrices
	};
}

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

export function orderSubscriptionUpdate(account: string) {
	return {
		type: CST.AC_ORDER_SUB,
		account: account
	};
}

// export function orderBookSubscriptionUpdate(pair: string) {
// 	return {
// 		type: CST.AC_OB_SUB,
// 		pair: pair
// 	};
// }

export function orderBookSnapshotUpdate(orderBook: IOrderBookSnapshot) {
	return {
		type: CST.AC_OB_SNAPSHOT,
		value: orderBook
	};
}

// export function subscribeOrderBook(pair: string): VoidThunkAction {
// 	return dispatch => {
// 		// dispatch(orderBookSubscriptionUpdate(''));
// 		// dispatch(orderBookSubscriptionUpdate(pair));
// 		wsUtil.subscribeOrderBook(pair);
// 	};
// }

export function subscribeOrder(account: string): VoidThunkAction {
	return dispatch => {
		dispatch(orderSubscriptionUpdate(''));
		if (account && account !== CST.DUMMY_ADDR) {
			dispatch(orderSubscriptionUpdate(account));
			relayerClient.subscribeOrderHistory(account);
		}
	};
}

export function notificationUpdate(notification: INotification) {
	return {
		type: CST.AC_NOTIFICATION,
		value: notification
	};
}