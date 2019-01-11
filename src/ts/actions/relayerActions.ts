import * as CST from 'ts/common/constants';
import relayerClient from 'ts/common/relayerClient';
import {
	IAcceptedPrice,
	INotification,
	IOrderBookSnapshot,
	IPrice,
	IStatus,
	IToken,
	IUserOrder,
	IWsTradeResponse,
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

export function orderBookUpdate(orderBook: IOrderBookSnapshot) {
	return {
		type: CST.AC_ORDER_BOOK,
		value: orderBook
	};
}

export function tradeUpdate(orderBook: IWsTradeResponse) {
	return { type: CST.AC_TRADE, value: orderBook };
}

export function orderSubscriptionUpdate(account: string) {
	return {
		type: CST.AC_ORDER_SUB,
		account: account
	};
}

export function tradeSubscriptionUpdate(pair: string) {
	return {
		type: CST.AC_TRADE_SUB,
		pair: pair
	};
}

// export function orderBookSubscriptionUpdate(pair: string) {
// 	return {
// 		type: CST.AC_OB_SUB,
// 		pair: pair
// 	};
// }

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

export function subscribeTrade(pair: string): VoidThunkAction {
	return dispatch => {
		dispatch(tradeSubscriptionUpdate(''));
		if (pair && pair !== CST.DUMMY_PAIR) {
			dispatch(tradeSubscriptionUpdate(pair));
			relayerClient.subscribeTrade(pair);
		}
	};
}

export function notificationUpdate(notification: INotification) {
	return {
		type: CST.AC_NOTIFICATION,
		value: notification
	};
}
