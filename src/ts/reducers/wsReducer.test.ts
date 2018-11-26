import * as CST from '../common/constants';
import { initialState, wsReducer } from './wsReducer';

describe('ws reducer', () => {
	let state = initialState;

	test('default', () => {
		state = wsReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('connection', () => {
		state = wsReducer(state, {
			type: CST.AC_CONNECTION,
			value: true
		});
		expect(state).toMatchSnapshot();
	});

	test('tokens', () => {
		state = wsReducer(state, {
			type: CST.AC_TOKENS,
			value: ['token1']
		});
		expect(state).toMatchSnapshot();
	});

	test('status', () => {
		state = wsReducer(state, {
			type: CST.AC_STATUS,
			value: ['status1']
		});
		expect(state).toMatchSnapshot();
	});
});
