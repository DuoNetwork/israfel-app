import WebSocket from 'isomorphic-ws';
import orderUtil from '../../../../israfel-relayer/src/utils/orderUtil';
import * as CST from './constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IStatus,
	IToken,
	IUserOrder,
	IWsAddOrderRequest,
	IWsInfoResponse,
	IWsOrderBookResponse,
	IWsOrderBookUpdateResponse,
	IWsOrderHistoryRequest,
	IWsOrderHistoryResponse,
	IWsOrderRequest,
	IWsOrderResponse,
	IWsRequest,
	IWsResponse,
	IWsUserOrderResponse
} from './types';
import util from './util';
import web3Util from './web3Util';

class WsUtil {
	public ws: WebSocket | null = null;
	private handleConnected: () => any = () => ({});
	private handleReconnect: () => any = () => ({});
	private handleInfoUpdate: (tokens: IToken[], status: IStatus[]) => any = () => ({});
	private handleOrderUpdate: (userOrder: IUserOrder) => any = () => ({});
	private handleOrderHistoryUpdate: (userOrders: IUserOrder[]) => any = () => ({});
	private handleOrderError: (
		method: string,
		orderHash: string,
		error: string
	) => any = () => ({});
	private handleOrderBookSnapshot: (orderBookSnapshot: IOrderBookSnapshot) => any = () => ({});
	private handleOrderBookUpdate: (orderBookUpdate: IOrderBookSnapshotUpdate) => any = () => ({});
	private handleOrderBookError: (method: string, pair: string, error: string) => any = () => ({});
	public reconnectionNumber: number = 0;

	private reconnect() {
		this.ws = null;
		if (this.reconnectionNumber < 6) {
			this.handleReconnect();
			setTimeout(() => {
				this.connectToRelayer();
				this.reconnectionNumber++;
			}, 5000);
		} else alert('We have tried 6 times. Please try again later');
	}

	public connectToRelayer() {
		this.ws = new WebSocket(`wss://relayer.${__KOVAN__ ? 'dev' : 'live'}.israfel.info:8080`);
		this.ws.onopen = () => this.handleConnected();
		this.ws.onmessage = (m: any) => this.handleMessage(m.data.toString());
		this.ws.onerror = () => this.reconnect();
		this.ws.onclose = () => this.reconnect();
	}

	public handleOrderResponse(response: IWsResponse) {
		if (response.status !== CST.WS_OK)
			this.handleOrderError(
				response.method,
				(response as IWsOrderResponse).orderHash,
				response.status
			);
		else if (response.method === CST.WS_HISTORY)
			this.handleOrderHistoryUpdate((response as IWsOrderHistoryResponse).orderHistory);
		else this.handleOrderUpdate((response as IWsUserOrderResponse).userOrder);
	}

	public handleOrderBookResponse(orderBookResponse: IWsResponse) {
		if (orderBookResponse.status !== CST.WS_OK)
			this.handleOrderBookError(
				orderBookResponse.method,
				orderBookResponse.pair,
				orderBookResponse.status
			);
		else if (orderBookResponse.method === CST.DB_SNAPSHOT)
			this.handleOrderBookSnapshot(
				(orderBookResponse as IWsOrderBookResponse).orderBookSnapshot
			);
		else
			this.handleOrderBookUpdate(
				(orderBookResponse as IWsOrderBookUpdateResponse).orderBookUpdate
			);
	}

	public handleMessage(message: string) {
		const res: IWsResponse = JSON.parse(message);
		if (res.method !== CST.WS_UNSUB)
			switch (res.channel) {
				case CST.DB_ORDERS:
					this.handleOrderResponse(res as IWsOrderResponse);
					break;
				case CST.DB_ORDER_BOOKS:
					this.handleOrderBookResponse(res);
					break;
				case CST.WS_INFO:
					const { tokens, processStatus } = res as IWsInfoResponse;
					web3Util.setTokens(tokens);
					this.handleInfoUpdate(tokens, processStatus);
					break;
				default:
					break;
			}
	}

	public subscribeOrderBook(pair: string) {
		if (!this.ws) return;

		const msg: IWsRequest = {
			method: CST.WS_SUB,
			channel: CST.DB_ORDER_BOOKS,
			pair: pair
		};
		this.ws.send(JSON.stringify(msg));
	}

	public unsubscribeOrderBook(pair: string) {
		if (!this.ws) return;

		const msg: IWsRequest = {
			method: CST.WS_UNSUB,
			channel: CST.DB_ORDER_BOOKS,
			pair: pair
		};
		this.ws.send(JSON.stringify(msg));
	}

	public subscribeOrderHistory(account: string, pair: string) {
		if (!this.ws) return;

		if (!web3Util.isValidAddress(account)) return;

		const msg: IWsOrderHistoryRequest = {
			method: CST.WS_SUB,
			channel: CST.DB_ORDERS,
			pair: pair,
			account: account
		};
		this.ws.send(JSON.stringify(msg));
	}

	public unsubscribeOrderHistory(account: string, pair: string) {
		if (!this.ws) return;

		const msg: IWsOrderHistoryRequest = {
			method: CST.WS_UNSUB,
			channel: CST.DB_ORDERS,
			pair: pair,
			account: account
		};
		this.ws.send(JSON.stringify(msg));
	}

	public async addOrder(
		account: string,
		pair: string,
		price: number,
		amount: number,
		isBid: boolean,
		secondsToLive: number
	) {
		if (!this.ws) return;
		if (!web3Util.isValidPair(pair))
			throw new Error('Invalid pair');
		const [code1, code2] = pair.split('|');
		const token1 = web3Util.tokens.find(t => t.code === code1);
		if (!token1)
			throw new Error('Invalid pair');
		const address1 = token1.address;
		const address2 = web3Util.getTokenAddressFromCode(code2);
		const amountAfterFee = orderUtil.getAmountAfterFee(amount, price, token1.feeSchedules[code2], isBid);

		const rawOrder = await web3Util.createRawOrder(
			account,
			web3Util.relayerAddress,
			isBid ? address2 : address1,
			isBid ? address1 : address2,
			amountAfterFee.makerAssetAmount,
			amountAfterFee.takerAssetAmount,
			secondsToLive + Math.ceil(util.getUTCNowTimestamp() / 1000)
		);
		const msg: IWsAddOrderRequest = {
			method: CST.DB_ADD,
			channel: CST.DB_ORDERS,
			pair: pair,
			orderHash: rawOrder.orderHash,
			order: rawOrder.signedOrder
		};
		this.ws.send(JSON.stringify(msg));
	}

	public deleteOrder(pair: string, orderHash: string) {
		if (!this.ws) return;

		const msg: IWsOrderRequest = {
			method: CST.DB_TERMINATE,
			channel: CST.DB_ORDERS,
			pair: pair,
			orderHash: orderHash
		};
		this.ws.send(JSON.stringify(msg));
	}

	public onOrder(
		handleHistory: (userOrders: IUserOrder[]) => any,
		handleUpdate: (userOrder: IUserOrder) => any,
		handleError: (method: string, orderHash: string, error: string) => any
	) {
		this.handleOrderHistoryUpdate = handleHistory;
		this.handleOrderUpdate = handleUpdate;
		this.handleOrderError = handleError;
	}

	public onOrderBook(
		handleSnapshot: (orderBookSnapshot: IOrderBookSnapshot) => any,
		handleUpdate: (orderBookUpdate: IOrderBookSnapshotUpdate) => any,
		handleError: (method: string, pair: string, error: string) => any
	) {
		this.handleOrderBookSnapshot = handleSnapshot;
		this.handleOrderBookUpdate = handleUpdate;
		this.handleOrderBookError = handleError;
	}

	public onConnection(handleConnected: () => any, handleReconnect: () => any) {
		this.handleConnected = handleConnected;
		this.handleReconnect = handleReconnect;
	}

	public onInfoUpdate(handleInfoUpdate: (tokens: IToken[], status: IStatus[]) => any) {
		this.handleInfoUpdate = handleInfoUpdate;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
