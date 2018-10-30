import store from './store';

describe('store', () => {
	test('actions', () => {
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getState()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
