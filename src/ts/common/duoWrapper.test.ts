import * as Constants from '@finbook/duo-contract-wrapper/dist/constants';
jest.mock('@finbook/duo-contract-wrapper', () => ({
	Constants: Constants,
	Web3Wrapper: jest.fn(() => 'web3Wrapper'),
	DualClassWrapper: jest.fn(() => ({
		contract: 'dualClassWrapper'
	})),
	EsplanadeWrapper: jest.fn(() => ({
		contract: 'EsplanadeWrapper'
	})),
	MagiWrapper: jest.fn(() => ({
		contract: 'MagiWrapper'
	}))
}));

import { Web3Wrapper } from '@finbook/duo-contract-wrapper';

import { duoWeb3Wrapper } from './duoWrapper';

test('web3Wrapper', () => {
	expect(duoWeb3Wrapper).toBeTruthy();
	expect((Web3Wrapper as any).mock.calls).toMatchSnapshot();
});
