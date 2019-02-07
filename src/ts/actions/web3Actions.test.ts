// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { dualClassWrappers } from 'ts/common/duoWrapper';
import web3Util from 'ts/common/web3Util';
import { Constants } from '../../../../israfel-common/src';
import * as web3Actions from './web3Actions';

const mockStore = configureMockStore([thunk]);

describe('actions', () => {
	test('accountUpdate', () => {
		expect(web3Actions.accountUpdate('test')).toMatchSnapshot();
	});

	test('getAccount', () => {
		const store: any = mockStore({});
		web3Util.getCurrentAddress = jest.fn(() => Promise.resolve('0x0'));
		store.dispatch(web3Actions.getAccount());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('getAccount empty', () => {
		const store: any = mockStore({});
		web3Util.getCurrentAddress = jest.fn(() => Promise.resolve(''));
		store.dispatch(web3Actions.getAccount());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions().length).toBe(0);
				resolve();
			}, 0)
		);
	});

	test('networkUpdate', () => {
		expect(web3Actions.networkUpdate(123)).toMatchSnapshot();
	});

	test('getNetwork', () => {
		const store: any = mockStore({});
		web3Util.getCurrentNetwork = jest.fn(() => Promise.resolve(123));
		store.dispatch(web3Actions.getNetwork());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('ethBalanceUpdate', () => {
		expect(
			web3Actions.ethBalanceUpdate({
				eth: 123,
				weth: 456,
				allowance: 789
			})
		).toMatchSnapshot();
	});

	test('tokenBalanceUpdate', () => {
		expect(
			web3Actions.tokenBalanceUpdate('code', 'custodian', {
				balance: 123,
				allowance: 456,
				address: '0xAddress'
			})
		).toMatchSnapshot();
	});

	test('custodianUpdate', () => {
		expect(
			web3Actions.custodianUpdate('custodian', 'custodianCode', 'custodianStates' as any)
		).toMatchSnapshot();
	});

	test('getCustodianBalances dummy', () => {
		const store: any = mockStore({
			web3: {
				account: Constants.DUMMY_ADDR
			},
			relayer: {
				tokens: [
					{
						custodian: 'custodian',
						code: 'code',
						address: '0xAddress'
					}
				]
			}
		});
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		web3Util.getTokenAllowance = jest.fn(() => Promise.resolve(333));
		dualClassWrappers['custodian'] = {
			getStates: jest.fn(() => Promise.resolve('custodianStates')),
			getContractCode: jest.fn(() => Promise.resolve('custodianCode'))
		} as any;
		store.dispatch(web3Actions.getCustodianBalances());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(web3Util.getEthBalance as jest.Mock).not.toBeCalled();
				expect(web3Util.getTokenBalance as jest.Mock).not.toBeCalled();
				expect(web3Util.getTokenAllowance as jest.Mock).not.toBeCalled();
				expect(dualClassWrappers['custodian'].getStates as jest.Mock).toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('getCustodianBalances', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			},
			relayer: {
				tokens: [
					{
						custodian: 'custodian',
						code: 'code'
					}
				]
			}
		});
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		web3Util.getTokenAllowance = jest.fn(() => Promise.resolve(333));
		dualClassWrappers['custodian'] = {
			getStates: jest.fn(() => Promise.resolve('custodianStates')),
			getContractCode: jest.fn(() => Promise.resolve('custodianCode'))
		} as any;
		store.dispatch(web3Actions.getCustodianBalances());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((web3Util.getEthBalance as jest.Mock).mock.calls).toMatchSnapshot();
				expect((web3Util.getTokenBalance as jest.Mock).mock.calls).toMatchSnapshot();
				expect((web3Util.getTokenAllowance as jest.Mock).mock.calls).toMatchSnapshot();
				expect(dualClassWrappers['custodian'].getStates as jest.Mock).toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('refresh', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			},
			relayer: {
				tokens: [
					{
						custodian: 'custodian',
						code: 'code'
					}
				]
			}
		});
		web3Util.getCurrentNetwork = jest.fn(() => Promise.resolve(123));
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		web3Util.getTokenAllowance = jest.fn(() => Promise.resolve(333));
		web3Util.getCurrentAddress = jest.fn(() => Promise.resolve('0x0'));
		dualClassWrappers['custodian'] = {
			getStates: jest.fn(() => Promise.resolve('custodianStates')),
			getContractCode: jest.fn(() => Promise.resolve('custodianCode'))
		} as any;
		store.dispatch(web3Actions.refresh());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
