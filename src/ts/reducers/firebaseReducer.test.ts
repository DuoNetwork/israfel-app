import * as CST from 'ts/common/constants';
import { firebaseReducer, initialState } from './firebaseReducer';

describe('firebase reducer', () => {
	let state = initialState;

	test('default', () => {
		state = firebaseReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('auth', () => {
		state = firebaseReducer(state, { type: CST.AC_AUTH, [CST.AC_AUTH]: true });
		expect(state).toMatchSnapshot();
	});
});
