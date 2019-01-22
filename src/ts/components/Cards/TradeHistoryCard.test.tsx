/**
 * @jest-environment jsdom
 */
import { shallow } from 'enzyme';
import * as React from 'react';
// import { SButton, SInput, SSlider } from './_styled';
import TradeHistoryCard from './TradeHistoryCard';
import util from 'ts/common/util';

describe('TradeHistoryCard Test', () => {
	describe('Test Snapshot', () => {
		it('Test Snapshot', () => {
			util.formatTime = jest.fn(() => '01-01 00:00:00');

			const wrapper1 = shallow(
				<TradeHistoryCard
					trades={{
						'aETH|WETH': [
							{
								pair: 'test',
								transactionHash: 'txHash',
								taker: {
									orderHash: 'test',
									address: 'test',
									side: 'test',
									price: 123,
									amount: 123,
									fee: 123
								},
								maker: { orderHash: 'test', price: 123, amount: 123, fee: 123 },
								feeAsset: 'test',
								timestamp: 123
							}
						]
					}}
					tokens={[
						{
							custodian: 'test',
							address: 'test',
							code: 'aETH',
							denomination: 123,
							precisions: { WETH: 123 },
							feeSchedules: { WETH: { rate: 123, minimum: 123 } },
							maturity: 123
						}
					]}
					tokenBalances={[
						{
							code: 'aETH',
							balance: 123,
							address: '0x00be45fe5903ab1b33a9d3969b05b29552a6d18b'
						}
					]}
				/>
			);
			expect(wrapper1).toMatchSnapshot();
		});

		it('Test getDerivedStateFromProps', () => {
			util.formatTime = jest.fn(() => '01-01 00:00:00');

			const wrapper1 = shallow(
				<TradeHistoryCard
					trades={{
						'MOZART-PPT|WETH': [
							{
								pair: 'test',
								transactionHash: 'test',
								taker: {
									orderHash: 'test',
									address: 'test',
									side: 'bid',
									price: 123,
									amount: 123,
									fee: 123
								},
								maker: { orderHash: 'test', price: 12, amount: 123, fee: 123 },
								feeAsset: 'test',
								timestamp: 123
							}
						]
					}}
					tokens={[
						{
							custodian: 'test',
							address: '0x00be45fe5903ab1b33a9d3969b05b29552a6d18b',
							code: 'MOZART-PPT',
							denomination: 12,
							precisions: { test: 123 },
							feeSchedules: { test: { asset: 'test', rate: 123, minimum: 123 } },
							maturity: 123
						}
					]}
					tokenBalances={[
						{
							code: 'MOZART-PPT',
							balance: 123,
							address: '0x00be45fe5903ab1b33a9d3969b05b29552a6d18b'
						}
					]}
				/>
			);
			wrapper1.setState({ pair: '' });
			wrapper1.setProps({
				tokenBalances: [
					{
						code: 'MOZART-PPT',
						balance: 123,
						address: '0x00be45fe5903ab1b33a9d3969b05b29552a6d18b'
					}
				]
			});
			expect(wrapper1).toMatchSnapshot();
			expect(wrapper1).toMatchSnapshot();
		});
	});
});
