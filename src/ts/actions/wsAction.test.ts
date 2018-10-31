// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
import * as wsActions from './wsActions';

// const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('userOrder', () => {
		expect(wsActions.userOrderUpdate({ test: 'test' } as any)).toMatchSnapshot();
	});
});
