import { AnyAction } from 'redux';
import * as CST from 'ts/common/constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IToken,
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
	orderBookSnapshot: {},
	orderHistory: {},
	orderSubscription: '',
	level: '',
	message: ''
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	switch (action.type) {
		case CST.AC_CONNECTION:
			return Object.assign({}, state, {
				connection: action.value
			});
		case CST.AC_INFO:
			const newCodes = (action.tokens as IToken[]).map(token => token.code);
			const oldCodes = state.tokens.map(token => token.code);
			newCodes.sort();
			oldCodes.sort();
			if (JSON.stringify(newCodes) !== JSON.stringify(oldCodes)) {
				oldCodes.forEach(code => {
					if (!newCodes.includes(code))
						wsUtil.unsubscribeOrderBook(code + '|' + CST.TH_WETH);
				});
				newCodes.forEach(code => {
					if (!oldCodes.includes(code))
						wsUtil.subscribeOrderBook(code + '|' + CST.TH_WETH);
				});
			}
			return Object.assign({}, state, {
				tokens: action.tokens,
				status: action.status,
				acceptedPrices: action.acceptedPrices,
				exchangePrices: action.exchangePrices
			});
		case CST.AC_OB_SNAPSHOT:
			return Object.assign({}, state, {
				orderBookSnapshot: Object.assign({}, state.orderBookSnapshot, {
					[action.value.pair]: action.value
				})
			});
		case CST.AC_OB_UPDATE:
			if (state.orderBookSnapshot[action.value.pair]) {
				const obUpdate: IOrderBookSnapshotUpdate = action.value;
				const orderBook: IOrderBookSnapshot = JSON.parse(
					JSON.stringify(state.orderBookSnapshot[obUpdate.pair])
				);
				orderBookUtil.updateOrderBookSnapshot(orderBook, obUpdate);
				return Object.assign({}, state, {
					orderBookSnapshot: Object.assign({}, state.orderBookSnapshot, {
						[obUpdate.pair]: orderBook
					})
				});
			} else return state;
		case CST.AC_ORDER_HISTORY:
			if ((action.value as IUserOrder[]).length) {
				const orderHistory: { [pair: string]: IUserOrder[] } = {};
				(action.value as IUserOrder[]).forEach(o => {
					if (!orderHistory[o.pair]) orderHistory[o.pair] = [];
					orderHistory[o.pair].push(o);
				});
				for (const pair in orderHistory)
					orderHistory[pair].sort(
						(a, b) =>
							-a.initialSequence + b.initialSequence ||
							-a.currentSequence + b.currentSequence
					);
				return Object.assign({}, state, {
					orderHistory: orderHistory
				});
			} else return state;
		case CST.AC_ORDER:
			const newOrder: IUserOrder = action.value;
			if (state.orderHistory[newOrder.pair]) {
				const newOrderArray = [
					...state.orderHistory[newOrder.pair].filter(
						o => o.currentSequence !== newOrder.currentSequence
					),
					newOrder
				];
				newOrderArray.sort(
					(a, b) =>
						-a.initialSequence + b.initialSequence ||
						-a.currentSequence + b.currentSequence
				);
				return Object.assign({}, state, {
					orderHistory: Object.assign({}, state.orderHistory, {
						[newOrder.pair]: newOrderArray
					})
				});
			} else
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
				if (orderSubscription && orderSubscription !== CST.DUMMY_ADDR)
					wsUtil.unsubscribeOrderHistory(orderSubscription);

				return {
					...restOrder,
					orderHistory: {},
					orderSubscription: ''
				};
			}
		case CST.AC_MESSAGE:
			return Object.assign({}, state, {
				level: action.level,
				message: action.message
			});
		default:
			return state;
	}
}
