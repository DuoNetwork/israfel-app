// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import { Constants } from '@finbook/israfel-common';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import relayerClient from 'ts/common/relayerClient';
import * as relayerActions from './relayerActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('connectionUpdate', () => {
		expect(relayerActions.connectionUpdate(true)).toMatchSnapshot();
	});

	test('infoUpdate', () => {
		expect(
			relayerActions.infoUpdate(
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
		expect(relayerActions.orderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderHistoryUpdate', () => {
		expect(relayerActions.orderHistoryUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	test('orderSubscriptionUpdate', () => {
		expect(relayerActions.orderSubscriptionUpdate('account')).toMatchSnapshot();
	});

	test('orderBookUpdate', () => {
		expect(relayerActions.orderBookUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('tradeUpdate', () => {
		expect(relayerActions.tradeUpdate('test', ['test' as any])).toMatchSnapshot();
	});

	test('subscribeOrder dummy account', () => {
		const store: any = mockStore({});
		relayerClient.subscribeOrderHistory = jest.fn();
		store.dispatch(relayerActions.subscribeOrder(Constants.DUMMY_ADDR));
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
		store.dispatch(relayerActions.subscribeOrder('account'));
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
			relayerActions.notificationUpdate({
				level: 'level',
				title: 'title',
				message: 'message',
				transactionHash: 'txHash'
			})
		).toMatchSnapshot();
	});
});
