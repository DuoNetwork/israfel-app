import { AnyAction } from 'redux';
import * as CST from 'ts/common/constants';
import { IDexState, IOrderBookSnapshot, IOrderBookSnapshotUpdate } from 'ts/common/types';
import wsUtil from 'ts/common/wsUtil';
import orderBookUtil from '../../../../israfel-relayer/src/utils/orderBookUtil';

export const initialState: IDexState = {
	userOrders: [],
	orderBookSnapshot: {
		pair: 'pair',
		version: 0,
		bids: [],
		asks: []
	},
	orderBookSubscription: '',
	userOrderSubscription: 0
};

export function dexReducer(state: IDexState = initialState, action: AnyAction): IDexState {
	switch (action.type) {
		case CST.AC_USER_ORDERS:
			return Object.assign({}, state, {
				[action.type]: action.value
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
				orderBookUtil.updateOrderBookSnapshot(
					orderBook,
					obUpdate
				);
				return Object.assign({}, state, {
					orderBookSnapshot: orderBook
				});
			} else return state;
		case CST.AC_OB_SUB:
			if (action.value)
				return Object.assign({}, state, {
					orderBookSubscription: action.value
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
		default:
			return state;
	}
}
