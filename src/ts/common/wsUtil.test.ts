import * as CST from 'ts/common/constants';
import orderUtil from '../../../../israfel-relayer/src/utils/orderUtil';
import util from './util';
import web3Util from './web3Util';
import wsUtil from './wsUtil';

test('handleOrderResponse ok', () => {
	const handleUpdate = jest.fn();
	const handleError = jest.fn();
	const handleHistory = jest.fn();
	wsUtil.onOrder(handleHistory, handleUpdate, handleError);
	wsUtil.handleOrderResponse({
		channel: 'channel',
		method: 'method',
		status: CST.WS_OK,
		orderHash: '0xOrderHash',
		pair: 'pair',
		userOrder: 'userOrder'
	} as any);
	expect(handleUpdate.mock.calls).toMatchSnapshot();
	expect(handleHistory).not.toBeCalled();
	expect(handleError).not.toBeCalled();
});

test('handleOrderResponse history', () => {
	const handleUpdate = jest.fn();
	const handleError = jest.fn();
	const handleHistory = jest.fn();
	wsUtil.onOrder(handleHistory, handleUpdate, handleError);
	wsUtil.handleOrderResponse({
		channel: 'channel',
		method: CST.WS_HISTORY,
		status: CST.WS_OK,
		pair: 'pair',
		orderHistory: 'orderHistory'
	} as any);
	expect(handleUpdate).not.toBeCalled();
	expect(handleHistory.mock.calls).toMatchSnapshot();
	expect(handleError).not.toBeCalled();
});

test('handleOrderResponse not ok', () => {
	const handleUpdate = jest.fn();
	const handleError = jest.fn();
	const handleHistory = jest.fn();
	wsUtil.onOrder(handleHistory, handleUpdate, handleError);
	wsUtil.handleOrderResponse({
		channel: 'channel',
		method: 'method',
		status: 'status',
		orderHash: '0xOrderHash',
		pair: 'pair'
	} as any);
	expect(handleUpdate).not.toBeCalled();
	expect(handleHistory).not.toBeCalled();
	expect(handleError.mock.calls).toMatchSnapshot();
});

test('handleOrderBookResponse snapshot', () => {
	const handleSnapshot = jest.fn();
	const handleUpdate = jest.fn();
	const handleError = jest.fn();
	wsUtil.onOrderBook(handleSnapshot, handleUpdate, handleError);
	wsUtil.handleOrderBookResponse({
		channel: 'channel',
		status: CST.WS_OK,
		method: CST.DB_SNAPSHOT,
		pair: 'pair',
		orderBookSnapshot: 'orderBookSnapshot'
	} as any);
	expect(handleSnapshot.mock.calls).toMatchSnapshot();
	expect(handleUpdate).not.toBeCalled();
	expect(handleError).not.toBeCalled();
});

test('handleOrderBookResponse update', () => {
	const handleSnapshot = jest.fn();
	const handleUpdate = jest.fn();
	const handleError = jest.fn();
	wsUtil.onOrderBook(handleSnapshot, handleUpdate, handleError);
	wsUtil.handleOrderBookResponse({
		channel: 'channel',
		status: CST.WS_OK,
		method: CST.DB_UPDATE,
		pair: 'pair',
		orderBookUpdate: 'orderBookUpdate'
	} as any);
	expect(handleSnapshot).not.toBeCalled();
	expect(handleUpdate.mock.calls).toMatchSnapshot();
	expect(handleError).not.toBeCalled();
});

test('handleOrderBookResponse not ok', () => {
	const handleSnapshot = jest.fn();
	const handleUpdate = jest.fn();
	const handleError = jest.fn();
	wsUtil.onOrderBook(handleSnapshot, handleUpdate, handleError);
	wsUtil.handleOrderBookResponse({
		channel: 'channel',
		status: 'status',
		method: 'any',
		pair: 'pair',
		orderBookUpdate: 'orderBookUpdate'
	} as any);
	expect(handleSnapshot).not.toBeCalled();
	expect(handleUpdate).not.toBeCalled();
	expect(handleError.mock.calls).toMatchSnapshot();
});

test('handleMessage unsub', () => {
	wsUtil.handleOrderResponse = jest.fn();
	wsUtil.handleOrderBookResponse = jest.fn();
	const handleInfo = jest.fn();
	wsUtil.onInfoUpdate(handleInfo);
	wsUtil.handleMessage(
		JSON.stringify({
			method: CST.WS_UNSUB
		})
	);
	expect(wsUtil.handleOrderResponse as jest.Mock).not.toBeCalled();
	expect(wsUtil.handleOrderBookResponse as jest.Mock).not.toBeCalled();
	expect(handleInfo).not.toBeCalled();
});

test('handleMessage invalid channel', () => {
	wsUtil.handleOrderResponse = jest.fn();
	wsUtil.handleOrderBookResponse = jest.fn();
	const handleInfo = jest.fn();
	wsUtil.onInfoUpdate(handleInfo);
	wsUtil.handleMessage(
		JSON.stringify({
			channel: 'channel'
		})
	);
	expect(wsUtil.handleOrderResponse as jest.Mock).not.toBeCalled();
	expect(wsUtil.handleOrderBookResponse as jest.Mock).not.toBeCalled();
	expect(handleInfo).not.toBeCalled();
});

test('handleMessage orders', () => {
	wsUtil.handleOrderResponse = jest.fn();
	wsUtil.handleOrderBookResponse = jest.fn();
	const handleInfo = jest.fn();
	wsUtil.onInfoUpdate(handleInfo);
	wsUtil.handleMessage(
		JSON.stringify({
			channel: CST.DB_ORDERS
		})
	);
	expect((wsUtil.handleOrderResponse as jest.Mock).mock.calls).toMatchSnapshot();
	expect(wsUtil.handleOrderBookResponse as jest.Mock).not.toBeCalled();
	expect(handleInfo).not.toBeCalled();
});

test('handleMessage orderBooks', () => {
	wsUtil.handleOrderResponse = jest.fn();
	wsUtil.handleOrderBookResponse = jest.fn();
	const handleInfo = jest.fn();
	wsUtil.onInfoUpdate(handleInfo);
	wsUtil.handleMessage(
		JSON.stringify({
			channel: CST.DB_ORDER_BOOKS
		})
	);
	expect(wsUtil.handleOrderResponse as jest.Mock).not.toBeCalled();
	expect((wsUtil.handleOrderBookResponse as jest.Mock).mock.calls).toMatchSnapshot();
	expect(handleInfo).not.toBeCalled();
});

test('handleMessage info', () => {
	web3Util.setTokens = jest.fn();
	wsUtil.handleOrderResponse = jest.fn();
	wsUtil.handleOrderBookResponse = jest.fn();
	const handleInfo = jest.fn();
	wsUtil.onInfoUpdate(handleInfo);
	wsUtil.handleMessage(
		JSON.stringify({
			channel: CST.WS_INFO,
			tokens: 'tokens',
			processStatus: 'status',
			acceptedPrices: 'acceptedPrices'
		})
	);
	expect(wsUtil.handleOrderResponse as jest.Mock).not.toBeCalled();
	expect(wsUtil.handleOrderBookResponse as jest.Mock).not.toBeCalled();
	expect((web3Util.setTokens as jest.Mock).mock.calls).toMatchSnapshot();
	expect(handleInfo.mock.calls).toMatchSnapshot();
});

test('subscribeOrderBook', () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	wsUtil.subscribeOrderBook('pair');
	expect(send.mock.calls).toMatchSnapshot();
});

test('unsubscribeOrderBook', () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	wsUtil.unsubscribeOrderBook('pair');
	expect(send.mock.calls).toMatchSnapshot();
});

test('subscribeOrderHistory invalid address', () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	wsUtil.subscribeOrderHistory('account', 'pair');
	expect(send).not.toBeCalled();
});

test('subscribeOrderHistory', () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	wsUtil.subscribeOrderHistory('0x48bacb9266a570d521063ef5dd96e61686dbe788', 'pair');
	expect(send.mock.calls).toMatchSnapshot();
});

test('unsubscribeOrderHistory', () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	wsUtil.unsubscribeOrderHistory('account', 'pair');
	expect(send.mock.calls).toMatchSnapshot();
});

test('addOrder bid', async () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	web3Util.getTokenAddressFromCode = jest.fn((code: string) => code + 'address');
	orderUtil.getAmountAfterFee = jest.fn(() => ({
		takerAssetAmount: 123,
		makerAssetAmount: 456
	}));
	web3Util.getTokenByCode = jest.fn(() => ({
		address: 'code1address',
		code: 'code1',
		precisions: {
			code2: 1
		},
		feeSchedules: {
			code2: {}
		}
	}));
	web3Util.createRawOrder = jest.fn(() => ({
		orderHash: 'orderHash',
		signedOrder: 'signedOrder'
	}));
	util.getUTCNowTimestamp = jest.fn(() => 1234567890);
	await wsUtil.addOrder(
		'account',
		'code1|code2',
		123,
		456,
		true,
		1234567890,
		{ eth: 10000, weth: 10000, allowance: 10000 },
		{ balance: 10000, allowance: 10000 }
	);
	expect(send.mock.calls).toMatchSnapshot();
	expect((orderUtil.getAmountAfterFee as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Util.createRawOrder as jest.Mock).mock.calls).toMatchSnapshot();
});

test('addOrder ask', async () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	web3Util.getTokenAddressFromCode = jest.fn((code: string) => code + 'address');
	orderUtil.getAmountAfterFee = jest.fn(() => ({
		takerAssetAmount: 123,
		makerAssetAmount: 456
	}));
	web3Util.getTokenByCode = jest.fn(() => ({
		address: 'code1address',
		code: 'code1',
		precisions: {
			code2: 1
		},
		feeSchedules: {
			code2: {}
		}
	}));
	web3Util.createRawOrder = jest.fn(() => ({
		orderHash: 'orderHash',
		signedOrder: 'signedOrder'
	}));
	util.getUTCNowTimestamp = jest.fn(() => 1234567890);
	await wsUtil.addOrder(
		'account',
		'code1|code2',
		123,
		456,
		false,
		1234567890,
		{ eth: 10000, weth: 10000, allowance: 10000 },
		{ balance: 10000, allowance: 10000 }
	);
	expect(send.mock.calls).toMatchSnapshot();
	expect((orderUtil.getAmountAfterFee as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Util.createRawOrder as jest.Mock).mock.calls).toMatchSnapshot();
});

test('deleteOrder', () => {
	const send = jest.fn();
	wsUtil.ws = { send } as any;
	wsUtil.deleteOrder('pair', 'orderHash', 'signature');
	expect(send.mock.calls).toMatchSnapshot();
});
