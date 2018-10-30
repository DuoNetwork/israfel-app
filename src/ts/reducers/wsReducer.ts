import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IWsState } from '../common/types';

export const initialState: IWsState = {
	userOrders: []
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	switch (action.type) {
		case CST.TH_SUBSCRIBE:
		case CST.TH_ADD_BIDASK:
			return Object.assign({}, state, { [action.type]: action[action.type] });
		default:
			return state;
	}
}
