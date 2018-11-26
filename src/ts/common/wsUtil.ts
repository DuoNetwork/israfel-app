import WebSocket from 'isomorphic-ws';
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
	private handleConfigError: (text: string) => any = () => ({});
	private handleConnected: () => any = () => ({});
	private handleReconnect: () => any = () => ({});
	private handleTokensUpdate: (tokens: IToken[]) => any = () => ({});
	private handleStatusUpdate: (status: IStatus[]) => any = () => ({});
	private handleOrderUpdate: (method: string, userOrder: IUserOrder) => any = () => ({});
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
		if (this.reconnectionNumber < 6) {
			this.handleReconnect();
			util.sleep(5000);
			this.connectToRelayer();
			this.reconnectionNumber += 1;
		} else alert('We have tried 6 times. Please try again later');
	}

	public async connectToRelayer() {
		this.ws = new WebSocket(`wss://relayer.${__KOVAN__ ? 'dev' : 'live'}.israfel.info:8080`);
		this.ws.onopen = () => this.handleConnected();
		this.ws.onmessage = (m: any) => this.handleMessage(m.data.toString());
		this.ws.onerror = () => {
			this.reconnect();
		};
		this.ws.onclose = () => {
			this.reconnect();
		};
	}

	private handleOrderResponse(orderResponse: IWsOrderResponse) {
		console.log(orderResponse);
		if (orderResponse.status !== CST.WS_OK)
			this.handleOrderError(
				orderResponse.method,
				orderResponse.orderHash,
				orderResponse.status
			);
		else
			this.handleOrderUpdate(
				orderResponse.method,
				(orderResponse as IWsUserOrderResponse).userOrder
			);
	}

	private handleOrderBookResponse(orderBookResponse: IWsResponse) {
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
		console.log(res);
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
					this.handleTokensUpdate(tokens);
					this.handleStatusUpdate(processStatus);
					break;
				case CST.WS_ORDER_HISTORY:
					this.handleOrderHistoryUpdate((res as IWsOrderHistoryResponse).orderHistory);
					break;
				default:
					break;
			}
	}

	public async subscribeOrderBook(pair: string) {
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}

		const msg: IWsRequest = {
			method: CST.WS_SUB,
			channel: CST.DB_ORDER_BOOKS,
			pair: pair
		};
		this.ws.send(JSON.stringify(msg));
	}

	public async unsubscribeOrderBook(pair: string) {
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}

		const msg: IWsRequest = {
			method: CST.WS_UNSUB,
			channel: CST.DB_ORDER_BOOKS,
			pair: pair
		};
		this.ws.send(JSON.stringify(msg));
	}

	public async subscribeOrderHistory(account: string, pair: string) {
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}

		const msg: IWsOrderHistoryRequest = {
			method: CST.WS_SUB,
			channel: CST.WS_ORDER_HISTORY,
			pair: pair,
			account: account
		};
		this.ws.send(JSON.stringify(msg));
	}

	public async unsubscribeOrderHistory(account: string, pair: string) {
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}

		const msg: IWsOrderHistoryRequest = {
			method: CST.WS_UNSUB,
			channel: CST.WS_ORDER_HISTORY,
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
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}
		const [code1, code2] = pair.split('|');
		const address1 = web3Util.getTokenAddressFromCode(code1);
		const address2 = web3Util.getTokenAddressFromCode(code2);
		const amount2 = util.round(amount * price);

		const rawOrder = await web3Util.createRawOrder(
			account,
			web3Util.relayerAddress,
			isBid ? address2 : address1,
			isBid ? address1 : address2,
			isBid ? amount2 : amount,
			isBid ? amount : amount2,
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

	public async deleteOrder(pair: string, orderHash: string) {
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}
		const msg: IWsOrderRequest = {
			method: CST.DB_TERMINATE,
			channel: CST.DB_ORDERS,
			pair: pair,
			orderHash: orderHash
		};
		this.ws.send(JSON.stringify(msg));
	}

	public onOrderUpdate(handleOrderUpdate: (method: string, userOrder: IUserOrder) => any) {
		this.handleOrderUpdate = handleOrderUpdate;
	}

	public onOrderHistoryUpdate(handleOrderHistoryUpdate: (userOrders: IUserOrder[]) => any) {
		this.handleOrderHistoryUpdate = handleOrderHistoryUpdate;
	}

	public onOrderError(
		handleOrderError: (method: string, orderHash: string, error: string) => any
	) {
		this.handleOrderError = handleOrderError;
	}

	public onOrderBookSnapshot(
		handleOrderBookSnapshot: (orderBookSnapshot: IOrderBookSnapshot) => any
	) {
		this.handleOrderBookSnapshot = handleOrderBookSnapshot;
	}

	public onOrderBookUpdate(
		handleOrderBookUpdate: (orderBookUpdate: IOrderBookSnapshotUpdate) => any
	) {
		this.handleOrderBookUpdate = handleOrderBookUpdate;
	}

	public onOrderBookError(
		handleOrderBookError: (method: string, pair: string, error: string) => any
	) {
		this.handleOrderBookError = handleOrderBookError;
	}

	public onReconnect(handleReconnect: () => any) {
		this.reconnectionNumber = 0;
		this.handleReconnect = handleReconnect;
	}

	public onConnected(handleConnected: () => any) {
		this.reconnectionNumber = 0;
		this.handleConnected = handleConnected;
	}

	public onTokensUpdate(handleTokensUpdate: (tokens: IToken[]) => any) {
		this.handleTokensUpdate = handleTokensUpdate;
	}

	public onStatusUpdate(handleStatusUpdate: (status: IStatus[]) => any) {
		this.handleStatusUpdate = handleStatusUpdate;
	}

	public onConfigError(handleConfigError: (text: string) => any) {
		this.handleConfigError = handleConfigError;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
