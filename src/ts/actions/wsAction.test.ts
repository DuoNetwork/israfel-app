import * as wsActions from './wsActions';

describe('actions', () => {
	test('connectionUpdate', () => {
		expect(wsActions.connectionUpdate(true)).toMatchSnapshot();
	});

	test('infoUpdate', () => {
		expect(
			wsActions.infoUpdate(['token1'] as any, ['status1'] as any, {
				custodian: ['acceptPrices'] as any
			})
		).toMatchSnapshot();
	});
});
