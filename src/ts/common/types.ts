import { SignedOrder } from '0x.js';
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
	readonly addBidAsk: IWSAskBid;
	// readonly addOrder: number[];
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

export interface IWSAskBid {
	amount: number;
	price: number;
	action: string;
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

export interface IBaseRequest {
	method: string;
	channel: string;
}

export interface IAddOrderRequest extends IBaseRequest {
	order: SignedOrder;
}

export enum WsChannelMessageTypes {
	Add = 'add',
	Cancel = 'cancel',
	Subscribe = 'subscribe'
}

export enum WsChannelName {
	Orderbook = 'orderbook',
	Order = 'order'
}

export interface IOption {
	live: boolean;
	token: string;
	maker: number;
	spender: number;
	amount: number;
}
