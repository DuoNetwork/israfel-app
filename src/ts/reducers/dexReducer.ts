import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IDexState } from '../common/types';

export const initialState: IDexState = {
	userOrders: [],
	orderBookSnapshot: {
		pair: 'pair',
		version: 0,
		bids: [],
		asks: []
	}
};

export function dexReducer(state: IDexState = initialState, action: AnyAction): IDexState {
	switch (action.type) {
		case CST.AC_USER_ORDERS:
			return Object.assign({}, state, {
				[action.type]: action.value
			});
		default:
			return state;
	}
}
