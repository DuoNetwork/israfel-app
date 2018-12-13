import { AnyAction } from 'redux';
import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IUserOrder,
	IWsState
} from 'ts/common/types';
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
	orderHistory: {},
	orderSubscription: ''
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
		case CST.AC_ORDER_HISTORY:
			if ((action.value as IUserOrder[]).length) {
				const orderHistory: { [pair: string]: IUserOrder[] } = {};
				(action.value as IUserOrder[]).forEach(o => {
					if (!orderHistory[o.pair]) orderHistory[o.pair] = [];
					orderHistory[o.pair].push(o);
				});
				return Object.assign({}, state, {
					orderHistory: orderHistory
				});
			} else return state;
		case CST.AC_ORDER:
			const newOrder: IUserOrder = action.value;
			if (state.orderHistory[newOrder.pair])
				return Object.assign({}, state, {
					orderHistory: Object.assign({}, state.orderHistory, {
						[newOrder.pair]: [
							...state.orderHistory[newOrder.pair].filter(
								o => o.currentSequence !== newOrder.currentSequence
							),
							newOrder
						]
					})
				});
			else
				return Object.assign({}, state, {
					orderHistory: Object.assign({}, state.orderHistory, {
						[newOrder.pair]: [newOrder]
					})
				});
		case CST.AC_ORDER_SUB:
			if (action.account)
				return Object.assign({}, state, {
					orderSubscription: action.account
				});
			else {
				const { orderHistory, orderSubscription, ...restOrder } = state;
				if (orderSubscription) wsUtil.unsubscribeOrderHistory(orderSubscription);

				return {
					...restOrder,
					orderHistory: {},
					orderSubscription: ''
				};
			}
		default:
			return state;
	}
}
