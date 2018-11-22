import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly dex: IDexState;
	readonly dynamo: IDynamoState;
	readonly ui: IUIState;
	readonly web3: IWeb3State;
	readonly ws: IWsState;
}

export interface IDexState {
	readonly userOrders: relayerTypes.IUserOrder[];
	readonly orderBookSnapshot: relayerTypes.IOrderBookSnapshot;
	readonly orderBookSubscription: string;
	readonly userOrderSubscription: number;
}

export interface IDynamoState {
	readonly status: relayerTypes.IStatus[];
}

export interface IUIState {
	readonly locale: string;
}

export interface IWeb3State {
	readonly account: string;
	readonly network: number;
}

export interface IWsState {
	readonly connection: boolean;
	readonly tokens: relayerTypes.IToken[]
}
