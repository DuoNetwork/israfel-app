import { AnyAction } from 'redux';
import * as CST from 'ts/common/constants';
import relayerClient from 'ts/common/relayerClient';
import { IRelayerState, IToken, IUserOrder } from 'ts/common/types';

export const initialState: IRelayerState = {
	connection: false,
	tokens: [],
	status: [],
	acceptedPrices: {},
	exchangePrices: {},
	orderBookSnapshot: {},
	orderHistory: {},
	orderSubscription: '',
	notification: {
		level: '',
		title: '',
		message: '',
		transactionHash: ''
	}
};

export function relayerReducer(
	state: IRelayerState = initialState,
	action: AnyAction
): IRelayerState {
	switch (action.type) {
		case CST.AC_CONNECTION:
			if (action.value)
				return Object.assign({}, state, {
					connection: action.value
				});
			else
				return initialState;
		case CST.AC_INFO:
			const newCodes = (action.tokens as IToken[]).map(token => token.code);
			const oldCodes = state.tokens.map(token => token.code);
			newCodes.sort();
			oldCodes.sort();
			if (JSON.stringify(newCodes) !== JSON.stringify(oldCodes)) {
				oldCodes.forEach(code => {
					if (!newCodes.includes(code))
						relayerClient.unsubscribeOrderBook(code + '|' + CST.TH_WETH);
				});
				newCodes.forEach(code => {
					if (!oldCodes.includes(code))
						relayerClient.subscribeOrderBook(code + '|' + CST.TH_WETH);
				});
			}
			return Object.assign({}, state, {
				tokens: action.tokens,
				status: action.status,
				acceptedPrices: action.acceptedPrices,
				exchangePrices: action.exchangePrices
			});
		case CST.AC_ORDER_BOOK:
			return Object.assign({}, state, {
				orderBookSnapshot: Object.assign({}, state.orderBookSnapshot, {
					[action.value.pair]: Object.assign({}, action.value)
				})
			});
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
					relayerClient.unsubscribeOrderHistory(orderSubscription);

				return {
					...restOrder,
					orderHistory: {},
					orderSubscription: ''
				};
			}
		case CST.AC_NOTIFICATION:
			return Object.assign({}, state, {
				notification: action.value
			});
		default:
			return state;
	}
}
