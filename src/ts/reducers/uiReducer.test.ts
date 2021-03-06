import * as CST from '../common/constants';
import { initialState, uiReducer } from './uiReducer';

describe('ui reducer', () => {
	let state = initialState;

	test('default', () => {
		state = uiReducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('locale', () => {
		state = uiReducer(state, {
			type: CST.AC_LOCALE,
			value: 'test'
		});
		expect(state).toMatchSnapshot();
	});
});
