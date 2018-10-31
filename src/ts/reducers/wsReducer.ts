import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IWsState } from '../common/types';

export const initialState: IWsState = {
	userOrders: []
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	switch (action.type) {
		case CST.AC_USER_ORDER:
			return Object.assign({}, state, {
				[CST.AC_USER_ORDER]: [...state.userOrders, action[action.type]]
			});
		default:
			return state;
	}
}
