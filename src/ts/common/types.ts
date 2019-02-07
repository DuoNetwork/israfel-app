import { IDualClassStates } from '@finbook/duo-contract-wrapper';
import { IAcceptedPrice, IPrice } from '@finbook/duo-market-data';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
export * from '../../../../israfel-relayer/src/common/types';
import * as relayerTypes from '../../../../israfel-relayer/src/common/types';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly relayer: IRelayerState;
	readonly ui: IUIState;
	readonly web3: IWeb3State;
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

export interface IRelayerState {
	readonly connection: boolean;
	readonly tokens: relayerTypes.IToken[];
	readonly status: relayerTypes.IStatus[];
	readonly trades: { [pair: string]: relayerTypes.ITrade[] };
	readonly acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	readonly exchangePrices: { [source: string]: IPrice[] };
	readonly orderBookSnapshots: { [pair: string]: relayerTypes.IOrderBookSnapshot };
	// readonly orderBookSubscription: string;
	readonly orderHistory: { [pair: string]: relayerTypes.IUserOrder[] };
	readonly orderSubscription: string;
	readonly notification: INotification;
}

export interface INotification {
	level: string;
	title: string;
	message: string;
	transactionHash: string;
}

export interface IEthBalance {
	eth: number;
	weth: number;
	allowance: number;
}

export interface ITokenBalance {
	balance: number;
	allowance: number;
	address: string;
}

export interface ICustodianInfo {
	code: string;
	states: IDualClassStates;
}
