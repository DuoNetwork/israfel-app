import { AnyAction } from 'redux';
import util from 'ts/common/util';
import * as CST from '../common/constants';
import { IWsState } from '../common/types';

export const initialState: IWsState = {
	connection: false,
	userOrders: [],
	orderBookSnapshot: {
		timestamp: 0,
		bids: [],
		asks: []
	}
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	switch (action.type) {
		case CST.AC_CONNECTION:
			return Object.assign({}, state, {
				[action.type]: action.value
			});
		case CST.AC_USER_ORDER:
			return Object.assign({}, state, {
				userOrders: util.operationOrder([...state.userOrders], action.value)
			});
		default:
			return state;
	}
}
