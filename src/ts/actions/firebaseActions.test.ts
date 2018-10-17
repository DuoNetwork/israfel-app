import * as firebaseActions from './firebaseActions';

describe('actions', () => {
	test('authUpdate', () => {
		expect(firebaseActions.authUpdate(true)).toMatchSnapshot();
	});
});
