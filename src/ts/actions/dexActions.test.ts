import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
// import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import * as dexActions from './dexActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('orderUpdate', () => {
		expect(dexActions.orderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderHistoryUpdate', () => {
		expect(dexActions.orderHistoryUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	// test('userSubscriptionUpdate', () => {
	// 	expect(dexActions.userSubscriptionUpdate(123)).toMatchSnapshot();
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

	// test('tokenBalanceUpdate', () => {
	// 	expect(
	// 		dexActions.tokenBalanceUpdate({
	// 			balance: 123,
	// 			allowance: 456
	// 		})
	// 	).toMatchSnapshot();
	// });

	// test('getTokenBalance dummy addr', () => {
	// 	const store: any = mockStore({});
	// 	web3Util.getTokenBalance = jest.fn(() => Promise.resolve(111));
	// 	web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(222));
	// 	store.dispatch(dexActions.getTokenBalance(CST.DUMMY_ADDR, 'code1|code2'));
	// 	return new Promise(resolve =>
	// 		setTimeout(() => {
	// 			expect(store.getActions()).toMatchSnapshot();
	// 			expect(web3Util.getTokenBalance as jest.Mock).not.toBeCalled();
	// 			expect(web3Util.getProxyTokenAllowance as jest.Mock).not.toBeCalled();
	// 			resolve();
	// 		}, 0)
	// 	);
	// });

	// test('getTokenBalance', () => {
	// 	const store: any = mockStore({});
	// 	web3Util.getTokenBalance = jest.fn(() => Promise.resolve(111));
	// 	web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(222));
	// 	store.dispatch(dexActions.getTokenBalance('0xAccount', 'code1|code2'));
	// 	return new Promise(resolve =>
	// 		setTimeout(() => {
	// 			expect(store.getActions()).toMatchSnapshot();
	// 			expect((web3Util.getTokenBalance as jest.Mock).mock.calls).toMatchSnapshot();
	// 			expect((web3Util.getProxyTokenAllowance as jest.Mock).mock.calls).toMatchSnapshot();
	// 			resolve();
	// 		}, 0)
	// 	);
	// });

	test('subscribe dummy account', () => {
		window.setInterval = jest.fn(() => 123);
		const store: any = mockStore({});
		wsUtil.subscribeOrderBook = jest.fn();
		wsUtil.subscribeOrderHistory = jest.fn();
		store.dispatch(dexActions.subscribe(CST.DUMMY_ADDR, 'pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
				expect((wsUtil.subscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('subscribe', () => {
		window.setInterval = jest.fn(() => 123);
		const store: any = mockStore({});
		wsUtil.subscribeOrderBook = jest.fn();
		wsUtil.subscribeOrderHistory = jest.fn();
		store.dispatch(dexActions.subscribe('0xAccount', 'pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
				expect((wsUtil.subscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
