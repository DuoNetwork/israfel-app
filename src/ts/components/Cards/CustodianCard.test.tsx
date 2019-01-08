/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
import { SButton, SCardTitle } from './_styled';
import CustodianCard from './CustodianCard';

describe('CustodianCard Test', () => {
	describe('Test Snapshot', () => {
		const type = 'Beethoven';
		const custodian = '0x66ad9d0b933da88bbee196b2a9c0badc901c4a3a';
		const tokenBalances = {
			'LETH-M19|WETH': {
				balance: 123,
				allowance: 123,
				address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
			}
		};
		const orderBooks = {
			'LETH-M19|WETH': {
				asks: [],
				bids: [],
				pair: 'LETH-M19|WETH',
				version: 1546414960315
			}
		};
		const info = {
			code: 'BEETHOVEN-PPT',
			states: {
				alpha: 1,
				beta: 1,
				createCommRate: 0.01,
				ethCollateral: 35.27156158513282,
				feeBalance: 16.29381269809767,
				iterationGasThreshold: 65000,
				lastOperationTime: 0,
				lastPrice: 144.17616996334993,
				lastPriceTime: 1546416000000,
				limitLower: 0.25,
				limitPeriodic: 1.013,
				limitUpper: 2,
				maturity: 0,
				minBalance: 0.01,
				navA: 1.001422,
				navB: 1.185862949651191,
				nextResetAddrIndex: 0,
				operationCoolDown: 86400000,
				period: 3600000,
				periodCoupon: 0.000006,
				preResetWaitingBlocks: 10,
				priceFetchCoolDown: 3000000,
				redeemCommRate: 0.01,
				resetPrice: 131.83117269319837,
				resetPriceTime: 1545562800000,
				resetState: 'UpwardReset',
				state: 'Trading',
				totalSupplyA: 2324.9456632442134,
				totalSupplyB: 2324.9456632442134,
				totalUsers: 26
			}
		};
		const margin = 'test';
		const acceptedPrice = [
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
		];
		const handleConvert = jest.fn(() => ({}));
		const handleTrade = jest.fn(() => ({}));
		const ethPrice = 123;
		it('Test Snapshot', () => {
			util.formatMaturity = jest.fn(() => '1970-01-01 08:00:00');
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const wrapper = shallow(
				<CustodianCard
					margin={margin}
					acceptedPrices={acceptedPrice}
					handleConvert={handleConvert}
					handleTrade={handleTrade}
					ethPrice={ethPrice}
					orderBooks={orderBooks}
					info={info}
					type={type}
					tokenBalances={tokenBalances}
					custodian={custodian}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(0)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(1)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(2)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(3)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
		});

		it('clicking "continue" button fires the callback', () => {
			const wrapper = mount(
				<CustodianCard
					margin={margin}
					acceptedPrices={acceptedPrice}
					handleConvert={handleConvert}
					handleTrade={handleTrade}
					ethPrice={ethPrice}
					orderBooks={orderBooks}
					info={info}
					type={type}
					tokenBalances={tokenBalances}
					custodian={custodian}
				/>
			);
			window.open = jest.fn();
			wrapper
				.find(SCardTitle)
				.at(0)
				.simulate('click');
			expect(window.open).toBeCalled();
		});
	});
});
