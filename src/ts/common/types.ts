import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export { IAcceptedPrice } from '../../../../duo-admin/src/common/types';
import { IAcceptedPrice } from '../../../../duo-admin/src/common/types';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly dex: IPairState;
	readonly ui: IUIState;
	readonly web3: IWeb3State;
	readonly ws: IWsState;
}

export interface IPairState {
	readonly orderHistory: relayerTypes.IUserOrder[];
	readonly orderBookSnapshot: relayerTypes.IOrderBookSnapshot;
	readonly orderBookSubscription: string;
	readonly userSubscription: number;
	readonly tokenBalance: ITokenBalance;
}

export interface IUIState {
	readonly locale: string;
}

export interface IWeb3State {
	readonly account: string;
	readonly network: number;
	readonly ethBalance: IEthBalance;
}

export interface IWsState {
	readonly connection: boolean;
	readonly tokens: relayerTypes.IToken[];
	readonly status: relayerTypes.IStatus[];
	readonly acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
}

export interface IEthBalance {
	eth: number;
	weth: number;
	allowance: number;
}

export interface ITokenBalance {
	balance: number;
	allowance: number;
}
