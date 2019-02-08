import * as Constants from '@finbook/israfel-common/dist/constants';
jest.mock('@finbook/israfel-common', () => ({
	Constants: Constants,
	Web3Util: jest.fn(() => ({}))
}));

import { Web3Util } from '@finbook/israfel-common';

import web3Util from './web3Util';

test('construction', () => {
	expect(web3Util).toBeTruthy();
	expect((Web3Util as any).mock.calls).toMatchSnapshot();
});
