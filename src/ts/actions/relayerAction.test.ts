import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
import relayerClient from 'ts/common/relayerClient';
import * as wsActions from './relayerActions';

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

	test('orderBookUpdate', () => {
		expect(wsActions.orderBookUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('subscribeOrder dummy account', () => {
		const store: any = mockStore({});
		relayerClient.subscribeOrderHistory = jest.fn();
		store.dispatch(wsActions.subscribeOrder(CST.DUMMY_ADDR));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(relayerClient.subscribeOrderHistory as jest.Mock).not.toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('subscribeOrder', () => {
		const store: any = mockStore({});
		relayerClient.subscribeOrderHistory = jest.fn();
		store.dispatch(wsActions.subscribeOrder('account'));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(
					(relayerClient.subscribeOrderHistory as jest.Mock).mock.calls
				).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('notificationUpdate', () => {
		expect(
			wsActions.notificationUpdate({
				level: 'level',
				title: 'title',
				message: 'message',
				transactionHash: 'txHash'
			})
		).toMatchSnapshot();
	});
});
