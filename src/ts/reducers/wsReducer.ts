import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IWSState } from '../common/types';

export const initialState: IWSState = {
	subscribe: {
		timestamp: 0,
		delay: 0,
		type: '',
		channel: { name: '', marketId: '' },
		requestId: 0,
		bids: [
			{
				makerTokenName: '',
				takerTokenName: '',
				marketId: '',
				side: '',
				amount: 0,
				price: 0
			}
		],
		asks: [
			{
				makerTokenName: '',
				takerTokenName: '',
				marketId: '',
				side: '',
				amount: 0,
				price: 0
			}
		]
	}
};

export function wsReducer(state: IWSState = initialState, action: AnyAction): IWSState {
	switch (action.type) {
		case CST.TH_SUBSCRIBE:
			return Object.assign({}, state, { [action.type]: action[action.type] });
		default:
			return state;
	}
}
