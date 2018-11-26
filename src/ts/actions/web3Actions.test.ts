import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CST from 'ts/common/constants';
import web3Util from 'ts/common/web3Util';
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
		expect(web3Actions.ethBalanceUpdate({
			eth: 123,
			weth: 456,
			allowance: 789
		})).toMatchSnapshot();
	});

	test('getBalance dummy', () => {
		const store: any = mockStore({
			web3: {
				account: CST.DUMMY_ADDR
			}
		});
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(333));
		store.dispatch(web3Actions.getBalance());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect(web3Util.getEthBalance as jest.Mock).not.toBeCalled();
				expect(web3Util.getTokenBalance as jest.Mock).not.toBeCalled();
				expect(web3Util.getProxyTokenAllowance as jest.Mock).not.toBeCalled();
				resolve();
			}, 0)
		);
	});

	test('getBalance', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(333));
		store.dispatch(web3Actions.getBalance());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				expect((web3Util.getEthBalance as jest.Mock).mock.calls).toMatchSnapshot();
				expect((web3Util.getTokenBalance as jest.Mock).mock.calls).toMatchSnapshot();
				expect((web3Util.getProxyTokenAllowance as jest.Mock).mock.calls).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});

	test('refresh', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		web3Util.getCurrentNetwork = jest.fn(() => Promise.resolve(123));
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		web3Util.getProxyTokenAllowance = jest.fn(() => Promise.resolve(333));
		web3Util.getCurrentAddress = jest.fn(() => Promise.resolve('0x0'));
		store.dispatch(web3Actions.refresh());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
