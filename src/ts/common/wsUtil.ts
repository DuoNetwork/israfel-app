import {
	assetDataUtils,
	BigNumber,
	generatePseudoRandomSalt,
	Order,
	orderHashUtils,
	signatureUtils,
	SignerType
} from '0x.js';
import { RPCSubprovider, SignerSubprovider, Web3ProviderEngine } from '@0xproject/subproviders';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
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
		this.web3Util = new Web3Util();
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

	public async addOrder(price: number, amount: number, isBid: boolean) {
		if (!this.web3Util) throw new Error('error');
		const zrxTokenAddress = this.web3Util.getTokenAddressFromName(CST.TOKEN_ZRX);
		const etherTokenAddress = this.web3Util.getTokenAddressFromName(CST.TOKEN_WETH);
		if (etherTokenAddress === undefined) throw console.error('undefined etherTokenAddress');

		const zrxAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
		const wethAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
		console.log(amount + '' + price + isBid + '');
		const providerEngine = new Web3ProviderEngine();
		providerEngine.addProvider(new SignerSubprovider((window as any).web3.currentProvider));
		providerEngine.addProvider(new RPCSubprovider(CST.PROVIDER_INFURA_KOVAN));
		providerEngine.start();

		// Get all of the accounts through the Web3Wrapper
		const web3Wrapper = new Web3Wrapper(providerEngine);
		const accounts = await web3Wrapper.getAvailableAddressesAsync();
		const exchangeAddress = this.web3Util.contractWrappers.exchange.getContractAddress();
		const order: Order = {
			senderAddress: accounts[0],
			makerAddress: accounts[0],
			takerAddress: accounts[0],
			makerFee: new BigNumber(0),
			takerFee: new BigNumber(0),
			makerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(price), 18),
			takerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), 18),
			makerAssetData: wethAssetData,
			takerAssetData: zrxAssetData,
			salt: generatePseudoRandomSalt(),
			exchangeAddress: exchangeAddress,
			feeRecipientAddress: accounts[0],
			expirationTimeSeconds: util.getRandomFutureDateInSeconds()
		};
		const orderHashHex = orderHashUtils.getOrderHashHex(order);
		const signature = await signatureUtils.ecSignOrderHashAsync(
			providerEngine,
			orderHashHex,
			accounts[0],
			SignerType.Metamask
		);
		const signedOrder = { ...order, signature };
		const pair = 'ZRX-WETH';
		const msg: IWsAddOrderRequest = {
			method: CST.DB_ADD,
			channel: CST.DB_ORDERS,
			pair: pair,
			orderHash: orderHashHex,
			order: JSON.parse(JSON.stringify(signedOrder))
		};
		this.ws.send(JSON.stringify(msg));
	}

	public onOrderBooks(handleOrderBooksUpdate: (orderBooks: IWsUserOrderResponse) => any) {
		this.handleOrderBooksUpdate = handleOrderBooksUpdate;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
