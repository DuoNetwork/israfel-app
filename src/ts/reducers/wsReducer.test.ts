import * as CST from 'ts/common/constants';
import wsUtil from 'ts/common/wsUtil';
import orderBookUtil from '../../../../israfel-relayer/src/utils/orderBookUtil';
import { initialState, wsReducer } from './wsReducer';

describe('ws reducer', () => {
	let state = initialState;

	test('default', () => {
		state = wsReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('connection', () => {
		state = wsReducer(state, {
			type: CST.AC_CONNECTION,
			value: true
		});
		expect(state).toMatchSnapshot();
	});

	test('info', () => {
		wsUtil.subscribeOrderBook = jest.fn();
		wsUtil.unsubscribeOrderBook = jest.fn();
		state = wsReducer(state, {
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
		expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
		expect(wsUtil.unsubscribeOrderBook as jest.Mock).not.toBeCalled();
	});

	test('info overlapping tokens', () => {
		wsUtil.subscribeOrderBook = jest.fn();
		wsUtil.unsubscribeOrderBook = jest.fn();
		state = wsReducer(state, {
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
		expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
		expect((wsUtil.unsubscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderBookSnapshot', () => {
		state = wsReducer(state, {
			type: CST.AC_OB_SNAPSHOT,
			value: {
				pair: 'pair',
				version: 123,
				bids: [1],
				asks: [2]
			}
		});
		expect(state).toMatchSnapshot();
	});

	test('orderBookSnapshot different pair', () => {
		state = wsReducer(state, {
			type: CST.AC_OB_SNAPSHOT,
			value: {
				pair: 'test'
			}
		});
		expect(state).toMatchSnapshot();
	});

	test('orderBookUpdate', () => {
		orderBookUtil.updateOrderBookSnapshot = jest.fn(() => ({
			pair: 'pair',
			version: 1234567890
		}));
		state = wsReducer(state, {
			type: CST.AC_OB_UPDATE,
			value: {
				pair: 'pair'
			}
		});
		expect(state).toMatchSnapshot();
		expect((orderBookUtil.updateOrderBookSnapshot as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderBookUpdate pair without snapshot', () => {
		orderBookUtil.updateOrderBookSnapshot = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_OB_UPDATE,
			value: {
				pair: 'test1'
			}
		});
		expect(state).toMatchSnapshot();
		expect(orderBookUtil.updateOrderBookSnapshot as jest.Mock).not.toBeCalled();
	});

	test('orderSubscription on', () => {
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: 'account'
		});
		expect(state).toMatchSnapshot();
	});

	test('orderHistory empty', () => {
		state = wsReducer(state, {
			type: CST.AC_ORDER_HISTORY,
			value: []
		});
		expect(state).toMatchSnapshot();
	});

	test('orderHistory', () => {
		state = wsReducer(state, {
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
		state = wsReducer(state, {
			type: CST.AC_ORDER,
			value: { userOrder: 'from single order', pair: 'pair1', currentSequence: 456 }
		});
		expect(state).toMatchSnapshot();
	});

	test('order new pair', () => {
		state = wsReducer(state, {
			type: CST.AC_ORDER,
			value: { userOrder: 'from single order', pair: 'pair3', currentSequence: 999 }
		});
		expect(state).toMatchSnapshot();
	});

	test('orderSubscription off', () => {
		wsUtil.unsubscribeOrderHistory = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
		expect((wsUtil.unsubscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderSubscription again', () => {
		wsUtil.unsubscribeOrderHistory = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
		expect(wsUtil.unsubscribeOrderHistory as jest.Mock).not.toBeCalled();
	});

	test('orderSubscription dummy', () => {
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: CST.DUMMY_ADDR
		});
		expect(state).toMatchSnapshot();
	});

	test('orderSubscription dummy off', () => {
		wsUtil.unsubscribeOrderHistory = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
		expect(wsUtil.unsubscribeOrderHistory as jest.Mock).not.toBeCalled();
	});

	test('message', () => {
		state = wsReducer(state, {
			type: CST.AC_MESSAGE,
			level: 'level',
			message: ' message',
			transactionHash: 'txHash'
		});
		expect(state).toMatchSnapshot();
	});
});
