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
import { IAddOrderRequest, WsChannelMessageTypes, WsChannelName } from '../common/types';
import assetsUtil from './assetsUtil';
import * as CST from './constants';
import { IWSChannel, IWSOrderBookSubscription } from './types';
import util from './util';

class WsUtil {
	public ws: WebSocket | null = null;
	private handleOrderBooksUpdate: ((orderBooks: IWSOrderBookSubscription) => any) | null = null;
	public init(host: string) {
		this.ws = new WebSocket(host);
		this.ws.onopen = function open() {
			console.log('Connected');
		};
		this.ws.onmessage = (m: any) => this.handleMessage(m.data.toString());
	}

	public handleMessage(message: string) {
		const wsMsg: IWSChannel = JSON.parse(message);
		const type = wsMsg.type;
		switch (type) {
			case CST.TH_SNAPSHOT:
			case CST.TH_UPDATE:
				if (this.handleOrderBooksUpdate) {
					const obRes = wsMsg as IWSOrderBookSubscription;
					// const src = others[0];
					if (obRes && obRes.asks && obRes.bids) {
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
			if (this.ws.readyState !== WebSocket.OPEN) {
				const wss = this.ws;
				this.ws.onopen = function open() {
					console.log('Connected');
					wss.send(JSON.stringify(req));
				};
			} else this.ws.send(JSON.stringify(req));
		}
	}

	public async addOrder(price: number, amount: number, isBid: boolean) {
		const wss = this.ws;
		const zrxTokenAddress = assetsUtil.getTokenAddressFromName(CST.TOKEN_ZRX);
		const etherTokenAddress = assetsUtil.getTokenAddressFromName(CST.TOKEN_WETH);

		if (etherTokenAddress === undefined) throw console.error('undefined etherTokenAddress');

		const zrxAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
		const wethAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
		console.log(amount + '' + price + isBid + '');
		const providerEngine = new Web3ProviderEngine();
		providerEngine.addProvider(new SignerSubprovider((window as any).web3.currentProvider));
		providerEngine.addProvider(new RPCSubprovider(CST.PROVIDER_LOCAL));
		providerEngine.start();
		(async () => {
			// Get all of the accounts through the Web3Wrapper
			const web3Wrapper = new Web3Wrapper(providerEngine);
			const accounts = await web3Wrapper.getAvailableAddressesAsync();
			const exchangeAddress = assetsUtil.contractWrappers.exchange.getContractAddress();
			// const zrxTokenAddress = assetsUtil.getTokenAddressFromName(CST.TOKEN_ZRX);
			// const etherTokenAddress = assetsUtil.getTokenAddressFromName(CST.TOKEN_WETH);
			const order: Order = {
				exchangeAddress: exchangeAddress,
				makerAddress: accounts[0],
				takerAddress: accounts[0],
				senderAddress: accounts[0],
				feeRecipientAddress: accounts[0],
				expirationTimeSeconds: util.getRandomFutureDateInSeconds(),
				salt: generatePseudoRandomSalt(),
				makerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(0.858), 18),
				takerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(0.868), 18),
				makerAssetData: wethAssetData,
				takerAssetData: zrxAssetData,
				makerFee: new BigNumber(0),
				takerFee: new BigNumber(0)
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
			const msg: IAddOrderRequest = {
				method: WsChannelMessageTypes.Add,
				channel: `${WsChannelName.Order}|${pair}`,
				order: signedOrder
			};
			console.log(wss);
			console.log(WebSocket.OPEN);
			if (wss.readyState !== WebSocket.OPEN)
				wss.onopen = function open() {
					console.log('Connected');
					wss.send(JSON.stringify(msg));
					console.log(`SENT ORDER: ${orderHashHex}`);
				};
			else wss.send(JSON.stringify(msg));
		})();
	}

	public onOrderBooks(handleOrderBooksUpdate: (orderBooks: IWSOrderBookSubscription) => any) {
		this.handleOrderBooksUpdate = handleOrderBooksUpdate;
	}
}

const wsUtil = new WsUtil();
export default wsUtil;
