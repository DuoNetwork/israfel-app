import * as CST from '../common/constants';
import { dexReducer, initialState } from './dexReducer';

describe('dex reducer', () => {
	let state = initialState;

	test('default', () => {
		state = dexReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('userOrder', () => {
		state = dexReducer(state, {
			type: CST.AC_USER_ORDER,
			value: { userOrder: 'test' }
		});
		expect(state).toMatchSnapshot();
	});

	test('userOrders', () => {
		state = dexReducer(state, {
			type: CST.AC_USER_ORDERS,
			value: [{
				userOrders: 'test'
			}]
		});
		expect(state).toMatchSnapshot();
	});
});
