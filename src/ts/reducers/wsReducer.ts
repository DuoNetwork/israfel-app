import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IWsState } from '../common/types';

export const initialState: IWsState = {
	connection: false,
	tokens: [],
	status: [],
	acceptedPrices: {}
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
				acceptedPrices: action.acceptedPrices
			});
		default:
			return state;
	}
}
