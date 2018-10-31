import * as CST from '../common/constants';
import { IUserOrder /*, VoidThunkAction*/ } from '../common/types';
// import wsUtil from '../common/wsUtil';

// export function onSubscription(marketId: string, pair: string): VoidThunkAction {
// 	return async () => {
// 		await wsUtil.subscribe(marketId, pair);
// 	};
// }

export function userOrderUpdate(userOrder: IUserOrder) {
	return {
		type: CST.AC_USER_ORDER,
		[CST.AC_USER_ORDER]: userOrder
	}
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
