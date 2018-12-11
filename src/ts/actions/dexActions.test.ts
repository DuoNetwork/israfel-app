import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
// import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import * as dexActions from './dexActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	// test('orderUpdate', () => {
	// 	expect(dexActions.orderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	// });

	// test('orderHistoryUpdate', () => {
	// 	expect(dexActions.orderHistoryUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	// });

	test('orderBookSnapshotUpdate', () => {
		expect(dexActions.orderBookSnapshotUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookUpdate', () => {
		expect(dexActions.orderBookUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookSubscriptionUpdate', () => {
		expect(dexActions.orderBookSubscriptionUpdate('account', 'pair')).toMatchSnapshot();
	});

	test('subscribe dummy account', () => {
		window.setInterval = jest.fn(() => 123);
		const store: any = mockStore({});
		wsUtil.subscribeOrderBook = jest.fn();
		// wsUtil.subscribeOrderHistory = jest.fn();
		store.dispatch(dexActions.subscribe(CST.DUMMY_ADDR, 'pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
				// expect((wsUtil.subscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('subscribe', () => {
		window.setInterval = jest.fn(() => 123);
		const store: any = mockStore({});
		wsUtil.subscribeOrderBook = jest.fn();
		// wsUtil.subscribeOrderHistory = jest.fn();
		store.dispatch(dexActions.subscribe('0xAccount', 'pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
				// expect((wsUtil.subscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
