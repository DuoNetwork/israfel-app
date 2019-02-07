/**
 * @jest-environment jsdom
 */
// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import { shallow } from 'enzyme';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { Constants } from '../../../../../israfel-common/src';
import Dex from './Dex';

describe('Dex Test', () => {
	describe('User Login', () => {
		it('Test Snapshot', () => {
			const account = 'test';
			const ethBalance = {
				allowance: 1.157920892373162,
				eth: 0.5076699707487066,
				weth: 0.984992
			};
			const acceptedPrices = {
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18b': [
					{
						blockNumber: 9835631,
						contractAddress: '0x00be45Fe5903AB1b33a9d3969b05b29552a6d18b',
						navA: 0.9554321303002988,
						navB: 1.0891357393994023,
						price: 128.45782891277358,
						timestamp: 1545782400000,
						transactionHash:
							'0x54c64c781b92e1d44d5229245e86b9aae602f126339e16d72f50162100e7b5e5'
					}
				]
			};
			const ethPrice = 123;
			const custodians = {
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18b': {
					code: 'MOZART-PPT',
					states: {
						alpha: 0.5,
						beta: 1,
						createCommRate: 0.01,
						ethCollateral: 12.358884504282397,
						feeBalance: 0.15089954869517602,
						iterationGasThreshold: 65000,
						lastOperationTime: 0,
						lastPrice: 145.11564352568783,
						lastPriceTime: 1546423200000,
						limitLower: 0.25,
						limitPeriodic: 0,
						limitUpper: 1.75,
						maturity: 0,
						minBalance: 0.01,
						navA: 0.8199774206003582,
						navB: 1.3600451587992837,
						nextResetAddrIndex: 0,
						operationCoolDown: 86400000,
						period: 3600000,
						periodCoupon: 0,
						preResetWaitingBlocks: 10,
						priceFetchCoolDown: 3000000,
						redeemCommRate: 0.01,
						resetPrice: 122.97700574468506,
						resetPriceTime: 1545530400000,
						resetState: 'UpwardReset',
						state: 'Trading',
						totalSupplyA: 506.61953689367846,
						totalSupplyB: 1013.2390737873569,
						totalUsers: 18
					}
				},
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18e': {
					code: 'MOZART-PPT',
					states: {
						alpha: 0.5,
						beta: 1,
						createCommRate: 0.01,
						ethCollateral: 12.358884504282397,
						feeBalance: 0.15089954869517602,
						iterationGasThreshold: 65000,
						lastOperationTime: 0,
						lastPrice: 145.11564352568783,
						lastPriceTime: 1546423200000,
						limitLower: 0.25,
						limitPeriodic: 0,
						limitUpper: 1.75,
						maturity: 0,
						minBalance: 0.01,
						navA: 0.8199774206003582,
						navB: 1.3600451587992837,
						nextResetAddrIndex: 0,
						operationCoolDown: 86400000,
						period: 3600000,
						periodCoupon: 0,
						preResetWaitingBlocks: 10,
						priceFetchCoolDown: 3000000,
						redeemCommRate: 0.01,
						resetPrice: 122.97700574468506,
						resetPriceTime: 1545530400000,
						resetState: 'UpwardReset',
						state: 'Trading',
						totalSupplyA: 506.61953689367846,
						totalSupplyB: 1013.2390737873569,
						totalUsers: 18
					}
				},
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18c': {
					code: 'BEETHOVEN-PPT',
					states: {
						alpha: 0.5,
						beta: 1,
						createCommRate: 0.01,
						ethCollateral: 12.358884504282397,
						feeBalance: 0.15089954869517602,
						iterationGasThreshold: 65000,
						lastOperationTime: 0,
						lastPrice: 145.11564352568783,
						lastPriceTime: 1546423200000,
						limitLower: 0.25,
						limitPeriodic: 0,
						limitUpper: 1.75,
						maturity: 0,
						minBalance: 0.01,
						navA: 0.8199774206003582,
						navB: 1.3600451587992837,
						nextResetAddrIndex: 0,
						operationCoolDown: 86400000,
						period: 3600000,
						periodCoupon: 0,
						preResetWaitingBlocks: 10,
						priceFetchCoolDown: 3000000,
						redeemCommRate: 0.01,
						resetPrice: 122.97700574468506,
						resetPriceTime: 1545530400000,
						resetState: 'UpwardReset',
						state: 'Trading',
						totalSupplyA: 506.61953689367846,
						totalSupplyB: 1013.2390737873569,
						totalUsers: 18
					}
				},
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18d': {
					code: 'BEETHOVEN-PPT',
					states: {
						alpha: 0.5,
						beta: 1,
						createCommRate: 0.01,
						ethCollateral: 12.358884504282397,
						feeBalance: 0.15089954869517602,
						iterationGasThreshold: 65000,
						lastOperationTime: 0,
						lastPrice: 145.11564352568783,
						lastPriceTime: 1546423200000,
						limitLower: 0.25,
						limitPeriodic: 0,
						limitUpper: 1.75,
						maturity: 0,
						minBalance: 0.01,
						navA: 0.8199774206003582,
						navB: 1.3600451587992837,
						nextResetAddrIndex: 0,
						operationCoolDown: 86400000,
						period: 3600000,
						periodCoupon: 0,
						preResetWaitingBlocks: 10,
						priceFetchCoolDown: 3000000,
						redeemCommRate: 0.01,
						resetPrice: 122.97700574468506,
						resetPriceTime: 1545530400000,
						resetState: 'UpwardReset',
						state: 'Trading',
						totalSupplyA: 506.61953689367846,
						totalSupplyB: 1013.2390737873569,
						totalUsers: 18
					}
				}
			};
			const custodianTokenBalances = {
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18b': {
					LETH: {
						balance: 0,
						allowance: 0,
						address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
					},
					sETH: {
						balance: 0,
						allowance: 1.157920892373162e59,
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886'
					}
				},
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18be': {
					LETH: {
						balance: 0,
						allowance: 0,
						address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
					},
					sETH: {
						balance: 0,
						allowance: 1.157920892373162e59,
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886'
					}
				},
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18bc': {
					LETH: {
						balance: 0,
						allowance: 0,
						address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
					},
					sETH: {
						balance: 0,
						allowance: 1.157920892373162e59,
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886'
					}
				},
				'0x00be45fe5903ab1b33a9d3969b05b29552a6d18d': {
					LETH: {
						balance: 0,
						allowance: 0,
						address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
					},
					sETH: {
						balance: 0,
						allowance: 1.157920892373162e59,
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886'
					}
				}
			};
			const trades = {
				'LETH-M19|WETH': [
					{
						feeAsset: 'aETH',
						maker: {
							amount: 1,
							fee: 0.05321100917431192,
							orderHash:
								'0x01268325a20092864f641f26739fa651605bb323065ee335f81ea5c8ff08eb46',
							price: 0.007545
						},
						pair: 'aETH|WETH',
						taker: {
							address: '0x66ad9d0b933da88bbee196b2a9c0badc901c4a3a',
							amount: 11.6,
							fee: 0.09999999999999999,
							orderHash:
								'0x26743ef8da563f1889f452983d339a0bcc3ccc5d821ab86e5cf62d9aeff7a9d0',
							price: 0.007545,
							side: 'bid'
						},
						timestamp: 1547113406963,
						transactionHash:
							'0x6b3713eaa66f56873cdcc9d7db0f6ba76cd2be1268b35d9b04d1ae57d558e577'
					}
				]
			};
			const orderBooks = {
				'LETH-M19|WETH': {
					asks: [],
					bids: [],
					pair: 'LETH-M19|WETH',
					version: 1546424305772
				}
			};
			const token = {
				address: '0x2B675f1A282954Ce4FEeb93b9504a6f78B616DE9',
				code: 'sETH-M19',
				custodian: '0x56e2727e56F9D6717e462418f822a8FE08Be4711',
				denomination: 0.1,
				feeSchedules: {
					WETH: {
						minimum: 0.1,
						rate: 0
					}
				},
				precisions: {
					WETH: 0.000005
				}
			};
			const orderHistory = {};
			const connection = true;
			const notify = jest.fn(() => ({}));
			const subscribeOrder = jest.fn();
			const unsubscribeOrder = jest.fn();
			const wrapEther = jest.fn();
			const unwrapEther = jest.fn();
			const setUnlimitedTokenAllowance = jest.fn();
			const web3PersonalSign = jest.fn();
			const addOrder = jest.fn();
			const deleteOrder = jest.fn();
			const componentWillUnmount = jest.fn();
			const wrapper = shallow(
				<Dex
					locale={CST.LOCALE_EN}
					network={Constants.NETWORK_ID_KOVAN}
					tokens={[token as any]}
					orderHistory={orderHistory}
					connection={connection}
					notify={notify}
					subscribeOrder={subscribeOrder}
					unsubscribeOrder={unsubscribeOrder}
					custodianTokenBalances={custodianTokenBalances}
					custodians={custodians}
					orderBooks={orderBooks}
					wethAddress={'wethAddress'}
					ethPrice={ethPrice}
					acceptedPrices={acceptedPrices}
					ethBalance={ethBalance}
					account={account}
					trades={trades}
					wrapEther={wrapEther}
					unwrapEther={unwrapEther}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					web3PersonalSign={web3PersonalSign}
					addOrder={addOrder}
					deleteOrder={deleteOrder}
				/>
			);
			expect(wrapper).toMatchSnapshot();

			wrapper.unmount();
			expect(componentWillUnmount.mock.calls.length).toBe(0);

			wrapper.setProps({ connection: false });
			expect(unsubscribeOrder.mock.calls.length).toBe(1);
			expect(wrapper).toMatchSnapshot();

			wrapper.setProps({ connection: true });
			expect(subscribeOrder.mock.calls.length).toBe(2);
			expect(wrapper).toMatchSnapshot();

			wrapper.setState({ tradeToken: 'a' });
			expect(wrapper).toMatchSnapshot();
			wrapper.setState({ tradeToken: 's' });
			expect(wrapper).toMatchSnapshot();
		});
	});
});
