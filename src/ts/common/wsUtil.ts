import WebSocket from 'isomorphic-ws';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';
import * as CST from './constants';
import { IUserOrder, IWsAddOrderRequest, IWsResponse, IWsUserOrderResponse } from './types';
import util from './util';
import web3Util from './web3Util';

class WsUtil {
	public ws: WebSocket | null = null;
	private handleOrderUpdate: (method: string, userOrder: IUserOrder) => any = () => ({});
	private handleConnected: () => any = () => ({});
	private handleReconnect: () => any = () => ({});
	private handleConfigError: (text: string) => any = () => ({});

	private reconnect() {
		this.handleReconnect();
		if (this.ws) {
			this.ws.removeAllListeners();
			this.ws.terminate();
		}
		this.connectToRelayer();
	}

	public async connectToRelayer() {
		const status = await dynamoUtil.scanStatus();
		const now = util.getUTCNowTimestamp();
		const relayerStatus = status.filter(
			s => s.tool === CST.DB_RELAYER && now - s.updatedAt < 15000
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
		this.ws.onerror = (error: Error) => {
			console.log(error);
			this.reconnect();
		};
		this.ws.onclose = (code: number, reason: string) => {
			console.log('connection closed ' + code + ' ' + reason);
			this.reconnect();
		};
	}

	public handleMessage(message: string) {
		const wsMsg: IWsResponse = JSON.parse(message);
		if (wsMsg.status !== CST.WS_OK) {
			console.log(message);
			return;
		}

		switch (wsMsg.channel) {
			case CST.DB_ORDERS:
				this.handleOrderUpdate(wsMsg.method, (wsMsg as IWsUserOrderResponse).userOrder);
				break;
			case CST.DB_ORDER_BOOKS:
				break;
			default:
				break;
		}
	}

	// public subscribe(name: string, marketId: string) {
	// 	if (this.ws && name && marketId) {
	// 		const req = {
	// 			type: 'subscribe',
	// 			channel: {
	// 				name: name,
	// 				marketId: marketId
	// 			},
	// 			requestId: Date.now().toString()
	// 		};
	// 		this.ws.send(JSON.stringify(req));
	// 	}
	// }

	public async addOrder(zrxAmt: number, ethAmt: number, isBid: boolean, expireTime: string) {
		const zrxTokenAddress = web3Util.getTokenAddressFromName(CST.TOKEN_ZRX);
		const etherTokenAddress = web3Util.getTokenAddressFromName(CST.TOKEN_WETH);
		if (etherTokenAddress === undefined) throw console.error('undefined etherTokenAddress');

		const accounts = await web3Util.web3Wrapper.getAvailableAddressesAsync();
		const rawOrder = await web3Util.createRawOrder(
			accounts[0],
			__DEV__ ? CST.RELAYER_ADDR_KOVAN : CST.RELAYER_ADDR_MAIN,
			isBid ? zrxTokenAddress : etherTokenAddress,
			isBid ? etherTokenAddress : zrxTokenAddress,
			isBid ? zrxAmt : ethAmt,
			isBid ? ethAmt : zrxAmt,
			Math.ceil(util.getUTCNowTimestamp() / 1000) + util.convertSecond(expireTime)
		);
		const pair = 'ZRX-WETH';
		const msg: IWsAddOrderRequest = {
			method: CST.DB_ADD,
			channel: CST.DB_ORDERS,
			pair: pair,
			orderHash: rawOrder.orderHash,
			order: rawOrder.signedOrder
		};
		this.ws.send(JSON.stringify(msg));
	}

	public onOrder(handleOrderUpdate: (method: string, userOrder: IUserOrder) => any) {
		this.handleOrderUpdate = handleOrderUpdate;
	}

	public onReconnect(handleReconnect: () => any) {
		this.handleReconnect = handleReconnect;
	}

	public onConnected(handleConnected: () => any) {
		this.handleConnected = handleConnected;
	}

	public onConfigError(handleConfigError: (text: string) => any) {
		this.handleConfigError = handleConfigError;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
