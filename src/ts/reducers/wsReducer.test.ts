import * as CST from '../common/constants';
import { initialState, wsReducer } from './wsReducer';

describe('ws reducer', () => {
	let state = initialState;

	test('default', () => {
		state = wsReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('userOrder', () => {
		state = wsReducer(state, {
			type: CST.AC_USER_ORDER,
			[CST.AC_USER_ORDER]: { userOrder: 'test' }
		});
		expect(state).toMatchSnapshot();
	});
});
