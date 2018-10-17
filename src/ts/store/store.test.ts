import * as firebaseActions from 'ts/actions/firebaseActions';
import store from './store';

describe('store', () => {
	test('actions', () => {
		store.dispatch(firebaseActions.authUpdate(true));
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getState()).toMatchSnapshot();
				resolve();
			}, 1000)
		);
	});
});
