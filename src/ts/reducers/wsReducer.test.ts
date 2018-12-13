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

	test('status', () => {
		state = wsReducer(state, {
			type: CST.AC_INFO,
			tokens: ['token1'],
			status: ['status1'],
			acceptedPrices: { custodian: ['acceptedPrices'] },
			exchangePrices: { source: ['exchangePrices'] }
		});
		expect(state).toMatchSnapshot();
	});

	test('orderBookSubscription on', () => {
		state = wsReducer(state, {
			type: CST.AC_OB_SUB,
			pair: 'pair'
		});
		expect(state).toMatchSnapshot();
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

	test('orderBookSnapshot wrong pair', () => {
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

	test('orderBookUpdate wrong pair', () => {
		orderBookUtil.updateOrderBookSnapshot = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_OB_UPDATE,
			value: {
				pair: 'test'
			}
		});
		expect(state).toMatchSnapshot();
		expect(orderBookUtil.updateOrderBookSnapshot as jest.Mock).not.toBeCalled();
	});

	test('orderBookSubscription off', () => {
		wsUtil.unsubscribeOrderBook = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_OB_SUB,
			account: 'account',
			pair: ''
		});
		expect(state).toMatchSnapshot();
		expect((wsUtil.unsubscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderBookSubscription off again', () => {
		wsUtil.unsubscribeOrderBook = jest.fn();
		state = wsReducer(state, {
			type: CST.AC_OB_SUB,
			account: 'account',
			pair: ''
		});
		expect(state).toMatchSnapshot();
		expect(wsUtil.unsubscribeOrderBook as jest.Mock).not.toBeCalled();
	});

	test('orderSubscription on', () => {
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: 'account'
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

	test('orderSubscription off', () => {
		state = wsReducer(state, {
			type: CST.AC_ORDER_SUB,
			account: ''
		});
		expect(state).toMatchSnapshot();
	});
});
