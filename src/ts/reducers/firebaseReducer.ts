import { AnyAction } from 'redux';
import * as CST from 'ts/common/constants';
import { IFirebaseState } from 'ts/common/types';

export const initialState = {
	[CST.AC_AUTH]: false
};

export function firebaseReducer(
	state: IFirebaseState = initialState,
	action: AnyAction
): IFirebaseState {
	switch (action.type) {
		case CST.AC_AUTH:
			return action[CST.AC_AUTH]
				? Object.assign({}, state, { [CST.AC_AUTH]: action[CST.AC_AUTH] })
				: initialState;
		default:
			return state;
	}
}
