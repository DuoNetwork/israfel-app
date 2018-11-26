// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
import * as wsActions from './wsActions';

// const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('connectionUpdate', () => {
		expect(wsActions.connectionUpdate(true)).toMatchSnapshot();
	});

	test('tokensUpdate', () => {
		expect(wsActions.tokensUpdate(['token1'] as any)).toMatchSnapshot();
	});

	test('statusUpdate', () => {
		expect(wsActions.statusUpdate(['status1'] as any)).toMatchSnapshot();
	});
});
