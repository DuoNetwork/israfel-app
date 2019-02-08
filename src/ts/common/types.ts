import { IDualClassStates } from '@finbook/duo-contract-wrapper';
import { IAcceptedPrice, IPrice } from '@finbook/duo-market-data';
import {
	IOrderBookSnapshot,
	IStatus,
	IToken,
	ITrade,
	IUserOrder
} from '@finbook/israfel-common';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

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
	readonly tokens: IToken[];
	readonly status: IStatus[];
	readonly trades: { [pair: string]: ITrade[] };
	readonly acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	readonly exchangePrices: { [source: string]: IPrice[] };
	readonly orderBookSnapshots: { [pair: string]: IOrderBookSnapshot };
	readonly orderHistory: { [pair: string]: IUserOrder[] };
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
