// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
import * as wsActions from './wsActions';

// const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('connectionUpdate', () => {
		expect(wsActions.connectionUpdate(true)).toMatchSnapshot();
	});

	test('infoUpdate', () => {
		expect(wsActions.infoUpdate(['token1'] as any, ['status1'] as any)).toMatchSnapshot();
	});
});
