import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';
import * as dexActions from './dexActions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('userOrder', () => {
		expect(dexActions.userOrderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('userOrdersUpdate', () => {
		expect(dexActions.userOrdersUpdate([{ test: 'test' }] as any)).toMatchSnapshot();
	});

	test('orderBookSnapshotUpdate', () => {
		expect(dexActions.orderBookSnapshotUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});

	test('orderBookUpdate', () => {
		expect(dexActions.orderBookUpdate({ test: 'test' } as any)).toMatchSnapshot();
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
		store.dispatch(dexActions.getUserOrders());
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
		store.dispatch(dexActions.getUserOrders());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
