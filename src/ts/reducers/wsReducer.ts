import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IWsState } from '../common/types';

export const initialState: IWsState = {
	connection: false,
	tokens: []
};

export function wsReducer(state: IWsState = initialState, action: AnyAction): IWsState {
	switch (action.type) {
		case CST.AC_CONNECTION:
		case CST.AC_TOKENS:
			return Object.assign({}, state, {
				[action.type]: action.value
			});
		default:
			return state;
	}
}
