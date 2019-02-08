import * as Constants from '@finbook/duo-contract-wrapper/dist/constants';
jest.mock('@finbook/duo-contract-wrapper', () => ({
	Constants: Constants,
	Web3Wrapper: jest.fn(() => 'web3Wrapper'),
	DualClassWrapper: jest.fn(() => ({
		contract: 'dualClassWrapper'
	}))
}));

import { DualClassWrapper, Web3Wrapper } from '@finbook/duo-contract-wrapper';

import { dualClassWrappers, duoWeb3Wrapper, getDualClassWrapper } from './duoWrapper';

test('Web3Wrapper', () => {
	expect(duoWeb3Wrapper).toBeTruthy();
	expect((Web3Wrapper as any).mock.calls).toMatchSnapshot();
});

test('DualClassWrapper', () => {
	getDualClassWrapper('custodian');
	expect(dualClassWrappers).toMatchSnapshot();
	expect((DualClassWrapper as any).mock.calls).toMatchSnapshot();
});
