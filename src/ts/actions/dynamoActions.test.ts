import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';
import * as dynamoActions from './dynamoActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('statusUpdate', () => {
		expect(dynamoActions.statusUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	test('scanStatus', () => {
		const store: any = mockStore({});
		dynamoUtil.scanStatus = jest.fn(() =>
			Promise.resolve({
				test: 'test'
			})
		);
		store.dispatch(dynamoActions.scanStatus());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('userOrdersUpdate', () => {
		expect(dynamoActions.userOrdersUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	test('getUserOrders dummy addr', () => {
		const store: any = mockStore({
			web3: {
				account: CST.DUMMY_ADDR
			}
		});
		dynamoUtil.getUserOrders = jest.fn(() =>
			Promise.resolve([{
				test: 'test'
			}])
		);
		store.dispatch(dynamoActions.getUserOrders());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('getUserOrders', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		dynamoUtil.getUserOrders = jest.fn(() =>
			Promise.resolve([{
				test: 'test'
			}])
		);
		store.dispatch(dynamoActions.getUserOrders());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
