import { AnyAction } from 'redux';
import * as CST from 'ts/common/constants';
import { IOrderBookSnapshot, IOrderBookSnapshotUpdate, IWsState } from 'ts/common/types';
import wsUtil from 'ts/common/wsUtil';
import orderBookUtil from '../../../../israfel-relayer/src/utils/orderBookUtil';

export const initialState: IWsState = {
	connection: false,
	tokens: [],
	status: [],
	acceptedPrices: {},
	exchangePrices: {},
	orderBookSnapshot: {
		pair: 'pair',
		version: 0,
		bids: [],
		asks: []
	},
	orderBookSubscription: '',
	orderHistory: {}
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	switch (action.type) {
		case CST.AC_CONNECTION:
			return Object.assign({}, state, {
				connection: action.value
			});
		case CST.AC_INFO:
			return Object.assign({}, state, {
				tokens: action.tokens,
				status: action.status,
				acceptedPrices: action.acceptedPrices,
				exchangePrices: action.exchangePrices
			});
		case CST.AC_OB_SNAPSHOT:
			if (state.orderBookSubscription === action.value.pair)
				return Object.assign({}, state, {
					orderBookSnapshot: action.value
				});
			else return state;
		case CST.AC_OB_UPDATE:
			if (state.orderBookSubscription === action.value.pair) {
				const obUpdate: IOrderBookSnapshotUpdate = action.value;
				const orderBook: IOrderBookSnapshot = JSON.parse(
					JSON.stringify(state.orderBookSnapshot)
				);
				orderBookUtil.updateOrderBookSnapshot(orderBook, obUpdate);
				return Object.assign({}, state, {
					orderBookSnapshot: orderBook
				});
			} else return state;
		case CST.AC_OB_SUB:
			if (action.pair)
				return Object.assign({}, state, {
					orderBookSubscription: action.pair
				});
			else {
				const { orderBookSnapshot, orderBookSubscription, ...restOb } = state;
				if (orderBookSubscription) wsUtil.unsubscribeOrderBook(orderBookSubscription);

				return {
					...restOb,
					orderBookSnapshot: {
						pair: 'pair',
						version: 0,
						bids: [],
						asks: []
					},
					orderBookSubscription: ''
				};
			}
		// case CST.AC_ORDER_HISTORY:
		// 	return Object.assign({}, state, {
		// 		orderHistory: action.value
		// 	});
		// case CST.AC_ORDER:
		// 	const newOrder: IUserOrder = action.value;
		// 	return Object.assign({}, state, {
		// 		orderHistory: [
		// 			...state.orderHistory.filter(
		// 				o => o.currentSequence !== newOrder.currentSequence
		// 			),
		// 			newOrder
		// 		]
		// 	});
		default:
			return state;
	}
}
