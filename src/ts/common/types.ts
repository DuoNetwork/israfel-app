import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly web3: IWeb3State;
	readonly ws: IWsState;
}

export interface IWeb3State {
	readonly account: string;
	readonly network: number;
}

export interface IWsState {
	readonly userOrders: relayerTypes.IUserOrder[];
}
