import * as uiActions from './uiActions';

describe('actions', () => {
	test('localeUpdate', () => {
		expect(uiActions.localeUpdate('test')).toMatchSnapshot();
	});
});
