import * as CST from '../common/constants';
import { IWSAskBid, VoidThunkAction } from '../common/types';
import { IWSOrderBookSubscription } from '../common/types';
import wsUtil from '../common/wsUtil';

export function onSubscription(marketId: string, pair: string): VoidThunkAction {
	return async () => {
		await wsUtil.subscribe(marketId, pair);
	};
}

export function orderBooksUpdate(message: IWSOrderBookSubscription) {
	return {
		type: CST.TH_SUBSCRIBE,
		[CST.TH_SUBSCRIBE]: message
	};
}

export function addOrder(message: IWSAskBid) {
	return { type: CST.TH_ADD_BIDASK, [CST.TH_ADD_BIDASK]: message };
}

export function addWSOrder(message: IWSAskBid): VoidThunkAction {
	return async () => {
		await wsUtil.addOrder(message.amount, message.price, message.action === "Sell" ? true : false);
	}
}

export function onAddOrders(amount: number, price: number, action: string): VoidThunkAction {
	return async dispatch => {
		dispatch(addOrder({ amount: amount, price: price, action: action }));
		dispatch(addWSOrder({ amount: amount, price: price, action: action }));
	};
}
