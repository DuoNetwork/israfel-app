import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly ws: IWsState;
}

export interface IWsState {
	readonly userOrders: relayerTypes.IUserOrder[];
}
