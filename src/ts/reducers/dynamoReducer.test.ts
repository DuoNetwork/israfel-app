import * as CST from '../common/constants';
import { dynamoReducer, initialState } from './dynamoReducer';

describe('dynamo reducer', () => {
	let state = initialState;

	test('default', () => {
		state = dynamoReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('status', () => {
		state = dynamoReducer(state, {
			type: CST.AC_STATUS,
			value: [{
				process: 'test'
			}]
		});
		expect(state).toMatchSnapshot();
	});

	test('userOrders', () => {
		state = dynamoReducer(state, {
			type: CST.AC_USER_ORDERS,
			value: [{
				userOrders: 'test'
			}]
		});
		expect(state).toMatchSnapshot();
	});
});
