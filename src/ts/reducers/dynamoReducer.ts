import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IDynamoState } from '../common/types';

export const initialState: IDynamoState = {
	status: [],
	userOrders: []
};

export function dynamoReducer(state: IDynamoState = initialState, action: AnyAction): IDynamoState {
	switch (action.type) {
		case CST.AC_STATUS:
		case CST.AC_USER_ORDERS:
			return Object.assign({}, state, {
				[action.type]: action.value
			});
		default:
			return state;
	}
}
