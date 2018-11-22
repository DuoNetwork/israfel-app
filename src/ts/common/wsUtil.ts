import WebSocket from 'isomorphic-ws';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';
import * as CST from './constants';
import {
	IOrderBookSnapshot,
	IOrderBookSnapshotUpdate,
	IToken,
	IUserOrder,
	IWsAddOrderRequest,
	IWsOrderBookResponse,
	IWsOrderBookUpdateResponse,
	IWsOrderRequest,
	IWsOrderResponse,
	IWsRequest,
	IWsResponse,
	IWsTokenResponse,
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
	private handleOrderUpdate: (method: string, userOrder: IUserOrder) => any = () => ({});
	private handleOrderError: (
		method: string,
		orderHash: string,
		error: string
	) => any = () => ({});
	private handleOrderBookSnapshot: (orderBookSnapshot: IOrderBookSnapshot) => any = () => ({});
	private handleOrderBookUpdate: (orderBookUpdate: IOrderBookSnapshotUpdate) => any = () => ({});
	private handleOrderBookError: (method: string, pair: string, error: string) => any = () => ({});

	private reconnect() {
		this.handleReconnect();
		this.connectToRelayer();
	}

	public async connectToRelayer() {
		const status = await dynamoUtil.scanStatus();
		const now = util.getUTCNowTimestamp();
		const relayerStatus = status.filter(
			s => s.tool === CST.DB_RELAYER && now - s.updatedAt < 60000
		);
		if (!relayerStatus.length) {
			this.handleConfigError('no relayer status');
			return;
		}
		let hostname = '';
		let clientCount = Number.MAX_SAFE_INTEGER;
		relayerStatus.forEach(r => {
			if (!r.count || r.count < clientCount) {
				clientCount = r.count || 0;
				hostname = r.hostname;
			}
		});

		const relayerServices = await dynamoUtil.getServices(CST.DB_RELAYER);
		const relayerService = relayerServices.find(r => r.hostname === hostname);
		if (!relayerService) {
			this.handleConfigError('no relayer config');
			return;
		}
		this.ws = new WebSocket(relayerService.url);
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
		console.log(orderBookResponse);
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
		switch (res.channel) {
			case CST.DB_ORDERS:
				this.handleOrderResponse(res as IWsOrderResponse);
				break;
			case CST.DB_ORDER_BOOKS:
				this.handleOrderBookResponse(res);
				break;
			case CST.DB_TOKENS:
				const tokens = (res as IWsTokenResponse).tokens;
				web3Util.setTokens(tokens);
				this.handleTokensUpdate(tokens);
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

	public async addOrder(account: string, pair: string, price: number, amount: number, isBid: boolean, secondsToLive: number) {
		if (!this.ws) {
			this.handleConfigError('not connected');
			return;
		}
		const [code1, code2] = pair.split('|');
		const address1 = web3Util.getTokenAddressFromCode(code1);
		const address2 = web3Util.getTokenAddressFromCode(code2);
		const amount2 = amount * price;

		const rawOrder = await web3Util.createRawOrder(
			account,
			web3Util.relayerAddress,
			isBid ? address2 : address1,
			isBid ? address1 : address2,
			isBid ? amount2 : amount,
			isBid ? amount : amount2,
			secondsToLive + util.getUTCNowTimestamp() / 1000
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
		console.log(msg);
		this.ws.send(JSON.stringify(msg));
	}

	public onOrderUpdate(handleOrderUpdate: (method: string, userOrder: IUserOrder) => any) {
		this.handleOrderUpdate = handleOrderUpdate;
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
		this.handleReconnect = handleReconnect;
	}

	public onConnected(handleConnected: () => any) {
		this.handleConnected = handleConnected;
	}

	public onTokensUpdate(handleTokensUpdate: (tokens: IToken[]) => any) {
		this.handleTokensUpdate = handleTokensUpdate;
	}

	public onConfigError(handleConfigError: (text: string) => any) {
		this.handleConfigError = handleConfigError;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
