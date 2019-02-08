import * as Constants from '../../../../israfel-common/src/constants';
jest.mock('../../../../israfel-common/src', () => ({
	Constants: Constants,
	Web3Util: jest.fn(() => ({}))
}));

import { Web3Util } from '../../../../israfel-common/src';

import web3Util from './web3Util';

test('construction', () => {
	expect(web3Util).toBeTruthy();
	expect((Web3Util as any).mock.calls).toMatchSnapshot();
});
