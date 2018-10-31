import WebSocket from 'isomorphic-ws';
import * as CST from '../../../../israfel-relayer/src/common/constants';
import {
	IUserOrder,
	IWsResponse,
	IWsUserOrderResponse
} from '../../../../israfel-relayer/src/common/types';
import { IWsAddOrderRequest } from './types';
import util from './util';
import web3Util from './web3Util';

class WsUtil {
	public ws: WebSocket | null = null;
	private handleOrderUpdate: (method: string, userOrder: IUserOrder) => any = () => ({});
	public init(host: string) {
		return new Promise(resolve => {
			this.ws = new WebSocket(host);
			this.ws.onopen = function open() {
				console.log('Connected');
				resolve();
			};
			this.ws.onmessage = (m: any) => this.handleMessage(m.data.toString());
		});
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
}

const wsUtil = new WsUtil();
export default wsUtil;
