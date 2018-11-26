import * as CST from 'ts/common/constants';
import wsUtil from 'ts/common/wsUtil';
import orderBookUtil from '../../../../israfel-relayer/src/utils/orderBookUtil';
import { dexReducer, initialState } from './dexReducer';

describe('dex reducer', () => {
	let state = initialState;

	test('default', () => {
		state = dexReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('userSubscription on', () => {
		state = dexReducer(state, {
			type: CST.AC_USER_SUB,
			value: 111
		});
		expect(state).toMatchSnapshot();
	});

	test('orderHistory', () => {
		state = dexReducer(state, {
			type: CST.AC_ORDER_HISTORY,
			value: [
				{
					userOrders: 'fromList',
					currentSequence: 123
				},
				{
					userOrders: 'fromList',
					currentSequence: 456
				}
			]
		});
		expect(state).toMatchSnapshot();
	});

	test('order', () => {
		state = dexReducer(state, {
			type: CST.AC_ORDER,
			value: { userOrder: 'from single order', currentSequence: 456 }
		});
		expect(state).toMatchSnapshot();
	});

	test('tokenBalance', () => {
		state = dexReducer(state, {
			type: CST.AC_TOKEN_BALANCE,
			value: {
				balance: 123,
				allowance: 456
			}
		});
	});

	test('userSubscription off', () => {
		window.clearInterval = jest.fn();
		state = dexReducer(state, {
			type: CST.AC_USER_SUB,
			value: 0
		});
		expect(state).toMatchSnapshot();
		expect((window.clearInterval as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('userSubscription off again', () => {
		window.clearInterval = jest.fn();
		state = dexReducer(state, {
			type: CST.AC_USER_SUB,
			value: 0
		});
		expect(state).toMatchSnapshot();
		expect(window.clearInterval as jest.Mock).not.toBeCalled();
	});

	test('orderBookSubscription on', () => {
		state = dexReducer(state, {
			type: CST.AC_OB_SUB,
			account: 'account',
			pair: 'pair'
		});
		expect(state).toMatchSnapshot();
	});

	test('orderBookSnapshot', () => {
		state = dexReducer(state, {
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
		state = dexReducer(state, {
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
		state = dexReducer(state, {
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
		state = dexReducer(state, {
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
		wsUtil.unsubscribeOrderHistory = jest.fn();
		state = dexReducer(state, {
			type: CST.AC_OB_SUB,
			account: 'account',
			pair: ''
		});
		expect(state).toMatchSnapshot();
		expect((wsUtil.unsubscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
		expect((wsUtil.unsubscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
	});

	test('orderBookSubscription off again', () => {
		wsUtil.unsubscribeOrderBook = jest.fn();
		wsUtil.unsubscribeOrderHistory = jest.fn();
		state = dexReducer(state, {
			type: CST.AC_OB_SUB,
			account: 'account',
			pair: ''
		});
		expect(state).toMatchSnapshot();
		expect(wsUtil.unsubscribeOrderBook as jest.Mock).not.toBeCalled();
		expect(wsUtil.unsubscribeOrderHistory as jest.Mock).not.toBeCalled();
	});
});
