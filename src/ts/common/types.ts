import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export { IDualClassStates } from '../../../../duo-admin/src/common/types';
import { IDualClassStates } from '../../../../duo-admin/src/common/types';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly ui: IUIState;
	readonly web3: IWeb3State;
	readonly ws: IWsState;
}

export interface IUIState {
	readonly locale: string;
}

export interface IWeb3State {
	readonly account: string;
	readonly network: number;
	readonly ethBalance: IEthBalance;
	readonly custodianTokenBalances: {
		[custodian: string]: {
			[code: string]: ITokenBalance;
		};
	};
	readonly custodians: {
		[custodian: string]: ICustodianInfo;
	};
}

export interface IWsState {
	readonly connection: boolean;
	readonly tokens: relayerTypes.IToken[];
	readonly status: relayerTypes.IStatus[];
	readonly acceptedPrices: { [custodian: string]: relayerTypes.IAcceptedPrice[] };
	readonly exchangePrices: { [source: string]: relayerTypes.IPrice[] };
	readonly orderBookSnapshot: {[pair: string]: relayerTypes.IOrderBookSnapshot};
	// readonly orderBookSubscription: string;
	readonly orderHistory: { [pair: string]: relayerTypes.IUserOrder[] };
	readonly orderSubscription: string;
	readonly level: string;
	readonly message: string
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

export interface ICustodianInfo {
	code: string;
	states: IDualClassStates;
}
