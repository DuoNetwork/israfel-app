import { AnyAction } from 'redux';
import util from 'ts/common/util';
import * as CST from '../common/constants';
import { IWsState } from '../common/types';

export const initialState: IWsState = {
	connection: false,
	userOrders: []
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	console.log(state.userOrders);
	console.log(action.value);
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
