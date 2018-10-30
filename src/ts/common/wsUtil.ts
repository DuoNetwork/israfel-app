import WebSocket from 'isomorphic-ws';
import * as CST from '../../../../israfel-relayer/src/common/constants';
import {
	IWsOrderResponse,
	IWsUserOrderResponse
} from '../../../../israfel-relayer/src/common/types';
import Web3Util from '../../../../israfel-relayer/src/utils/Web3Util';
import { IWsAddOrderRequest } from '../common/types';
import util from './util';

class WsUtil {
	public ws: WebSocket | null = null;
	private web3Util: Web3Util | null = null;
	private handleOrderBooksUpdate: ((orderBooks: IWsUserOrderResponse) => any) | null = null;
	public init(host: string) {
		this.web3Util = new Web3Util(window, !__DEV__);
		this.ws = new WebSocket(host);
		this.ws.onopen = function open() {
			console.log('Connected');
		};
		this.ws.onmessage = (m: any) => this.handleMessage(m.data.toString());
	}

	public handleMessage(message: string) {
		const wsMsg: IWsOrderResponse = JSON.parse(message);
		const method = wsMsg.method;
		switch (method) {
			case CST.DB_ADD:
				if (this.handleOrderBooksUpdate) {
					const obRes = wsMsg as IWsUserOrderResponse;
					// const src = others[0];
					if (obRes && obRes.userOrder) {
						// obRes.delay = util.getUTCNowTimestamp() - obRes.timestamp;
						console.log('obRes');
						this.handleOrderBooksUpdate(obRes);
					}
				}
				break;
			default:
				break;
		}
	}

	public subscribe(name: string, marketId: string) {
		if (this.ws && name && marketId) {
			const req = {
				type: 'subscribe',
				channel: {
					name: name,
					marketId: marketId
				},
				requestId: Date.now().toString()
			};
			this.ws.send(JSON.stringify(req));
		}
	}

	public async addOrder(zrxAmt: number, ethAmt: number, isBid: boolean) {
		if (!this.web3Util) throw new Error('error');
		const zrxTokenAddress = this.web3Util.getTokenAddressFromName(CST.TOKEN_ZRX);
		const etherTokenAddress = this.web3Util.getTokenAddressFromName(CST.TOKEN_WETH);
		if (etherTokenAddress === undefined) throw console.error('undefined etherTokenAddress');

		const accounts = await this.web3Util.web3Wrapper.getAvailableAddressesAsync();
		const rawOrder = await this.web3Util.createRawOrder(
			accounts[0],
			__DEV__ ? CST.RELAYER_ADDR_KOVAN : CST.RELAYER_ADDR_MAIN,
			isBid ? zrxTokenAddress : etherTokenAddress,
			isBid ? etherTokenAddress : zrxTokenAddress,
			isBid ? zrxAmt : ethAmt,
			isBid ? ethAmt : zrxAmt,
			Math.ceil(util.getUTCNowTimestamp() / 1000) + 3600
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

	public onOrderBooks(handleOrderBooksUpdate: (orderBooks: IWsUserOrderResponse) => any) {
		this.handleOrderBooksUpdate = handleOrderBooksUpdate;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
