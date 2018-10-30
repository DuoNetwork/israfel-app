import { IWsUserOrderResponse } from '../../../../israfel-relayer/src/common/types';
import * as CST from '../common/constants';
import { VoidThunkAction } from '../common/types';
import wsUtil from '../common/wsUtil';

export function onSubscription(marketId: string, pair: string): VoidThunkAction {
	return async () => {
		await wsUtil.subscribe(marketId, pair);
	};
}

export function orderBooksUpdate(message: IWsUserOrderResponse) {
	return {
		type: CST.TH_SUBSCRIBE,
		[CST.TH_SUBSCRIBE]: message
	};
}

// export function addWSOrder(message: IWSAskBid): VoidThunkAction {
// 	return async () => {
// 		await wsUtil.addOrder(message.amount, message.price, message.action === "Sell" ? true : false);
// 	}
// }

// export function onAddOrders(amount: number, price: number, action: string): VoidThunkAction {
// 	return async dispatch => {
// 		dispatch(addWSOrder({ amount: amount, price: price, action: action }));
// 	};
// }
