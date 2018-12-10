import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export { IAcceptedPrice, IDualClassStates } from '../../../../duo-admin/src/common/types';
import { IAcceptedPrice, IDualClassStates } from '../../../../duo-admin/src/common/types';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly dex: IDexState;
	readonly ui: IUIState;
	readonly web3: IWeb3State;
	readonly ws: IWsState;
}

export interface IDexState {
	readonly orderHistory: relayerTypes.IUserOrder[];
	readonly orderBookSnapshot: relayerTypes.IOrderBookSnapshot;
	readonly orderBookSubscription: string;
}

export interface IUIState {
	readonly locale: string;
}

export interface IWeb3State {
	readonly account: string;
	readonly network: number;
	readonly ethBalance: IEthBalance;
	readonly tokenBalances: {
		[code: string]: ITokenBalance;
	};
	readonly custodianStates: {
		[custodian: string]: IDualClassStates
	}
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
	custodian: string;
	balance: number;
	allowance: number;
}
