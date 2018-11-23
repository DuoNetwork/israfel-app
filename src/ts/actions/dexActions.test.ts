import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
import util from 'ts/common/util';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';
import * as dexActions from './dexActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('userOrder', () => {
		expect(dexActions.userOrderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('userOrderListUpdate', () => {
		expect(dexActions.userOrderListUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	test('userSubscriptionUpdate', () => {
		expect(dexActions.userSubscriptionUpdate(123)).toMatchSnapshot();
	});

	test('orderBookSnapshotUpdate', () => {
		expect(dexActions.orderBookSnapshotUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookUpdate', () => {
		expect(dexActions.orderBookUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookSubscriptionUpdate', () => {
		expect(dexActions.orderBookSubscriptionUpdate('pair')).toMatchSnapshot();
	});

	test('getUserOrders dummy addr', () => {
		const store: any = mockStore({
			web3: {
				account: CST.DUMMY_ADDR
			}
		});
		dynamoUtil.getUserOrders = jest.fn(() =>
			Promise.resolve([
				{
					test: 'test'
				}
			])
		);
		store.dispatch(dexActions.getUserOrders('pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(dynamoUtil.getUserOrders as jest.Mock).not.toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('getUserOrders', () => {
		util.getUTCNowTimestamp = jest.fn(() => 1234567890);
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		dynamoUtil.getUserOrders = jest.fn(() =>
			Promise.resolve([
				{
					test: 'test'
				}
			])
		);
		store.dispatch(dexActions.getUserOrders('pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((dynamoUtil.getUserOrders as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('tokenBalanceUpdate', () => {
		expect(
			dexActions.tokenBalanceUpdate({
				balance: 123,
				allowance: 456
			})
		).toMatchSnapshot();
	});

	test('getTokenBalance dummy addr', () => {
		const store: any = mockStore({
			web3: {
				account: CST.DUMMY_ADDR
			}
		});
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(222));
		store.dispatch(dexActions.getTokenBalance('code1|code2'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(web3Util.getTokenBalance as jest.Mock).not.toBeCalled();
				expect(web3Util.getProxyTokenAllowance as jest.Mock).not.toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('getTokenBalance', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(222));
		store.dispatch(dexActions.getTokenBalance('code1|code2'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((web3Util.getTokenBalance as jest.Mock).mock.calls).toMatchSnapshot();
				expect((web3Util.getProxyTokenAllowance as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('subscribe', () => {
		window.setInterval = jest.fn(() => 123);
		util.getUTCNowTimestamp = jest.fn(() => 1234567890);
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		dynamoUtil.getUserOrders = jest.fn(() =>
			Promise.resolve([
				{
					test: 'test'
				}
			])
		);
		wsUtil.subscribeOrderBook = jest.fn();
		store.dispatch(dexActions.subscribe('pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
				expect((dynamoUtil.getUserOrders as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
