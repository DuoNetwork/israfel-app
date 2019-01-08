/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
import { SButton, SInput } from './_styled';
import BalanceCard from './BalanceCard';

describe('BalanceCard Test', () => {
	describe('Test Snapshot', () => {
		const visible = true;
		const ethPrice = 123;
		const beethovenList = ['123', 'test'];
		const mozartList = ['test', '123'];
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
					lastPrice: 139.65558504384992,
					lastPriceTime: 1546412400000,
					limitLower: 0.25,
					limitPeriodic: 0,
					limitUpper: 1.75,
					maturity: 0,
					minBalance: 0.01,
					navA: 0.8643764401469363,
					navB: 1.2712471197061275,
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
					totalUsers: 13
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
			}
		};
		const ethBalance = {
			allowance: 1.157920892373,
			eth: 0.5076699707487066,
			weth: 0.984992
		};
		const handleClose = jest.fn();
		it('Test Snapshot', () => {
			util.formatMaturity = jest.fn(() => '1970-01-01 08:00:00');
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const wrapEther = jest.fn(() => Promise.resolve('txHash'));
			const unwrapEther = jest.fn(() => Promise.resolve('txHash'));
			const notify = jest.fn();
			const wrapper = shallow(
				<BalanceCard
					visible={visible}
					account={'account'}
					ethPrice={ethPrice}
					beethovenList={beethovenList}
					ethBalance={ethBalance}
					mozartList={mozartList}
					custodians={custodians}
					custodianTokenBalances={custodianTokenBalances}
					notify={notify}
					handleClose={handleClose}
					wrapEther={wrapEther}
					unwrapEther={unwrapEther}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SInput)
				.at(0)
				.simulate('change', { target: { value: '123456' } });
			wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '123456' } });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(1)
				.simulate('click');
			wrapper
				.find(SButton)
				.at(0)
				.simulate('click');
			expect(wrapEther.mock.calls).toMatchSnapshot();
			expect(unwrapEther.mock.calls).toMatchSnapshot();
			expect(notify.mock.calls).toMatchSnapshot();
		});
	});
});
