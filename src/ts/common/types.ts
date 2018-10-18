import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type VoidThunkAction = ThunkAction<void, IState, undefined, AnyAction>;

export interface IState {
	readonly firebase: IFirebaseState;
	readonly ws: IWSState;
}

export interface IFirebaseState {
	readonly auth: boolean;
}

export interface IWSState {
	readonly subscribe: IWSOrderBookSubscription;
}

export interface IWSChannel {
	type: string;
	channel: {
		name: string;
		marketId: string;
	};
	requestId: number;
	timestamp: number;
	delay?: number;
}

export interface IWSOrderBookSubscription extends IWSChannel {
	bids: [
		{
			makerTokenName: string;
			takerTokenName: string;
			marketId: string;
			side: string;
			amount: number;
			price: number;
		}
	];
	asks: [
		{
			makerTokenName: string;
			takerTokenName: string;
			marketId: string;
			side: string;
			amount: number;
			price: number;
		}
	];
}
