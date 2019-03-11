import * as Constants from '@finbook/duo-contract-wrapper/dist/constants';
import { kovan } from '@finbook/duo-contract-wrapper/dist/contractAddresses';
jest.mock('@finbook/duo-contract-wrapper', () => ({
	Constants: Constants,
	Web3Wrapper: jest.fn(() => ({ contractAddresses: kovan })),
	DualClassWrapper: jest.fn(() => ({
		contract: 'dualClassWrapper'
	})),
	VivaldiWrapper: jest.fn(() => ({
		contract: 'vivaldiWrapper'
	})),
}));

import { DualClassWrapper, VivaldiWrapper, Web3Wrapper } from '@finbook/duo-contract-wrapper';

import { custodianWrappers, duoWeb3Wrapper, getCustodianWrapper } from './duoWrapper';

test('Web3Wrapper', () => {
	expect(duoWeb3Wrapper).toBeTruthy();
	expect((Web3Wrapper as any).mock.calls).toMatchSnapshot();
});

test('custodianWrapper', () => {
	getCustodianWrapper('custodian');
	getCustodianWrapper(kovan.Custodians.Vivaldi['100C-1H'].custodian.address.toLowerCase());
	expect(custodianWrappers).toMatchSnapshot();
	expect((DualClassWrapper as any).mock.calls).toMatchSnapshot();
	expect((VivaldiWrapper as any).mock.calls).toMatchSnapshot();
});
