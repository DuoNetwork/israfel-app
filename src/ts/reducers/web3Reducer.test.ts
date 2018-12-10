import * as CST from '../common/constants';
import { initialState, web3Reducer } from './web3Reducer';

describe('web3 reducer', () => {
	let state = initialState;

	test('default', () => {
		state = web3Reducer(state, { type: 'any' });
		expect(state).toMatchSnapshot();
	});

	test('account', () => {
		state = web3Reducer(state, {
			type: CST.AC_ACCOUNT,
			value: 'test'
		});
		expect(state).toMatchSnapshot();
	});

	test('network', () => {
		state = web3Reducer(state, {
			type: CST.AC_NETWORK,
			value: 123
		});
		expect(state).toMatchSnapshot();
	});

	test('ethBalance', () => {
		state = web3Reducer(state, {
			type: CST.AC_ETH_BALANCE,
			value: {
				eth: 123,
				weth: 456,
				allowance: 789
			}
		});
		expect(state).toMatchSnapshot();
	});

	test('tokenBalance', () => {
		state = web3Reducer(state, {
			type: CST.AC_TOKEN_BALANCE,
			code: 'code',
			balance: {
				custodian: 'custodian',
				balance: 123,
				allowance: 789
			}
		});
		expect(state).toMatchSnapshot();
	});

	test('custodianState', () => {
		state = web3Reducer(state, {
			type: CST.AC_CTD_STATE,
			custodian: 'custodian',
			state: 'custodianState'
		});
		expect(state).toMatchSnapshot();
	});

	// test('gasPrice', () => {
	// 	state = web3Reducer(state, {
	// 		type: CST.AC_GAS_PX,
	// 		value: 123
	// 	});
	// 	expect(state).toMatchSnapshot();
	// });
});
