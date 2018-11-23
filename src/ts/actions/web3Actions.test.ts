import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import web3Util from '../common/web3Util';
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
			weth: 456
		})).toMatchSnapshot();
	});

	test('getNetwork', () => {
		const store: any = mockStore({
			web3: {
				account: '0xAccount'
			}
		});
		web3Util.getEthBalance = jest.fn(() => Promise.resolve(111));
		web3Util.getTokenBalance = jest.fn(() => Promise.resolve(222));
		store.dispatch(web3Actions.getBalance());
		return new Promise(resolve =>
			setTimeout(() => {
				expect(store.getActions()).toMatchSnapshot();
				resolve();
			}, 0)
		);
	});
});
