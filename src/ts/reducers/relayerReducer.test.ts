import * as CST from 'ts/common/constants';
import relayerClient from 'ts/common/relayerClient';
import { initialState, relayerReducer } from './relayerReducer';

describe('relayer reducer', () => {
	let state = initialState;

	test('default', () => {
		state = relayerReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('connection', () => {
		state = relayerReducer(state, {
			type: CST.AC_CONNECTION,
			value: true
		});
		expect(state).toMatchSnapshot();
	});

	test('info', () => {
		relayerClient.subscribeOrderBook = jest.fn();
		relayerClient.unsubscribeOrderBook = jest.fn();
		state = relayerReducer(state, {
			type: CST.AC_INFO,
			tokens: [
				{
					code: 'token1'
				},
				{
					code: 'token2'
				}
			],
			status: ['status1'],
			acceptedPrices: { custodian: ['acceptedPrices'] },
			exchangePrices: { source: ['exchangePrices'] }
		});
		expect(state).toMatchSnapshot();
		expect((relayerClient.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
		expect(relayerClient.unsubscribeOrderBook as jest.Mock).not.toBeCalled();
	});

	test('info overlapping tokens', () => {
		relayerClient.subscribeOrderBook = jest.fn();
		relayerClient.unsubscribeOrderBook = jest.fn();
		state = relayerReducer(state, {
			type: CST.AC_INFO,
			tokens: [
				{
					code: 'token2'
				},
				{
					code: 'token3'
				}
			],
			status: ['status1'],
			acceptedPrices: { custodian: ['acceptedPrices'] },
			exchangePrices: { source: ['exchangePrices'] }
		});
		expect(state).toMatchSnapshot();
		expect((relayerClient.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
		expect((relayerClient.unsubscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderBook', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER_BOOK,
			value: {
				pair: 'pair',
				version: 123,
				bids: [1],
				asks: [2]
			}
		});
		expect(state).toMatchSnapshot();
	});

	test('orderSubscription on', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: 'account'
		});
		expect(state).toMatchSnapshot();
	});

	test('orderHistory empty', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER_HISTORY,
			value: []
		});
		expect(state).toMatchSnapshot();
	});

	test('orderHistory', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER_HISTORY,
			value: [
				{
					userOrders: 'fromList',
					pair: 'pair1',
					currentSequence: 123
				},
				{
					userOrders: 'fromList',
					pair: 'pair1',
					currentSequence: 456
				},
				{
					userOrders: 'fromList',
					pair: 'pair2',
					currentSequence: 789
				}
			]
		});
		expect(state).toMatchSnapshot();
	});

	test('order', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER,
			value: { userOrder: 'from single order', pair: 'pair1', currentSequence: 456 }
		});
		expect(state).toMatchSnapshot();
	});

	test('order new pair', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER,
			value: { userOrder: 'from single order', pair: 'pair3', currentSequence: 999 }
		});
		expect(state).toMatchSnapshot();
	});

	test('orderSubscription off', () => {
		relayerClient.unsubscribeOrderHistory = jest.fn();
		state = relayerReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
		expect((relayerClient.unsubscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderSubscription again', () => {
		relayerClient.unsubscribeOrderHistory = jest.fn();
		state = relayerReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
		expect(relayerClient.unsubscribeOrderHistory as jest.Mock).not.toBeCalled();
	});

	test('orderSubscription dummy', () => {
		state = relayerReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: CST.DUMMY_ADDR
		});
		expect(state).toMatchSnapshot();
	});

	test('orderSubscription dummy off', () => {
		relayerClient.unsubscribeOrderHistory = jest.fn();
		state = relayerReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
		expect(relayerClient.unsubscribeOrderHistory as jest.Mock).not.toBeCalled();
	});

	test('notification', () => {
		state = relayerReducer(state, {
			type: CST.AC_NOTIFICATION,
			value: {
				level: 'level',
				title: 'title',
				message: ' message',
				transactionHash: 'txHash'
			}
		});
		expect(state).toMatchSnapshot();
	});
});
