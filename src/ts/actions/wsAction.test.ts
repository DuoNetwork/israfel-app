import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
import wsUtil from 'ts/common/wsUtil';
import * as wsActions from './wsActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('connectionUpdate', () => {
		expect(wsActions.connectionUpdate(true)).toMatchSnapshot();
	});

	test('infoUpdate', () => {
		expect(
			wsActions.infoUpdate(
				['token1'] as any,
				['status1'] as any,
				{
					custodian: ['acceptPrices'] as any
				},
				{
					source: ['exchangePrices'] as any
				}
			)
		).toMatchSnapshot();
	});

	test('orderUpdate', () => {
		expect(wsActions.orderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderHistoryUpdate', () => {
		expect(wsActions.orderHistoryUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	test('orderSubscriptionUpdate', () => {
		expect(wsActions.orderSubscriptionUpdate('account')).toMatchSnapshot();
	});

	test('orderBookSnapshotUpdate', () => {
		expect(wsActions.orderBookSnapshotUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookUpdate', () => {
		expect(wsActions.orderBookUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookSubscriptionUpdate', () => {
		expect(wsActions.orderBookSubscriptionUpdate('pair')).toMatchSnapshot();
	});

	test('subscribeOrderBook', () => {
		const store: any = mockStore({});
		wsUtil.subscribeOrderBook = jest.fn();
		store.dispatch(wsActions.subscribeOrderBook('pair'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderBook as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('subscribeOrderBook dummy account', () => {
		const store: any = mockStore({});
		wsUtil.subscribeOrderHistory = jest.fn();
		store.dispatch(wsActions.subscribeOrder(CST.DUMMY_ADDR));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(wsUtil.subscribeOrderHistory as jest.Mock).not.toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('subscribeOrderBook', () => {
		const store: any = mockStore({});
		wsUtil.subscribeOrderHistory = jest.fn();
		store.dispatch(wsActions.subscribeOrder('account'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((wsUtil.subscribeOrderHistory as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
