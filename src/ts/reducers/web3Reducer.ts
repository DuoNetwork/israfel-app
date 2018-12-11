import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IWeb3State } from '../common/types';

export const initialState: IWeb3State = {
	account: CST.DUMMY_ADDR,
	network: 0,
	ethBalance: {
		eth: 0,
		weth: 0,
		allowance: 0
	},
	custodianTokenBalances: {},
	custodians: {}
	// gasPrice: 0
};

export function web3Reducer(state: IWeb3State = initialState, action: AnyAction): IWeb3State {
	switch (action.type) {
		case CST.AC_ACCOUNT:
		case CST.AC_NETWORK:
		case CST.AC_ETH_BALANCE:
			return Object.assign({}, state, {
				[action.type]: action.value
			});
		case CST.AC_TOKEN_BALANCE:
			return Object.assign({}, state, {
				custodianTokenBalances: Object.assign({}, state.custodianTokenBalances, {
					[action.custodian]: Object.assign(
						{},
						state.custodianTokenBalances[action.custodian] || {},
						{
							[action.code]: action.balance
						}
					)
				})
			});
		case CST.AC_CUSTODIAN:
			return Object.assign({}, state, {
				custodians: Object.assign({}, state.custodians, {
					[action.custodian]: {
						code: action.code,
						states: action.states
					}
				})
			});
		default:
			return state;
	}
}
