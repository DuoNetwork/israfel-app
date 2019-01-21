/**
 * @jest-environment jsdom
 */
// import { Radio } from 'antd';
import { shallow } from 'enzyme';
// import { mount } from 'enzyme';
import * as React from 'react';
// import util from 'ts/common/util';
// import { SButton, SInput, SSlider } from './_styled';
import TradeHistoryCard from './TradeHistoryCard';
// const RadioGroup = Radio.Group;

describe('TradeHistoryCard Test', () => {
	describe('Test Snapshot', () => {
		// const tokenInfo = {
		// 	address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886',
		// 	code: 'bETH',
		// 	custodian: '0x13016f27945f3f7b39a5daae068d698e34e55491',
		// 	denomination: 0.1,
		// 	feeSchedules: {
		// 		WETH: {
		// 			minimum: 0.1,
		// 			rate: 0
		// 		}
		// 	},
		// 	precisions: { WETH: 0.000005 }
		// };
		// const tokenBalance = {
		// 	balance: 123,
		// 	allowance: 123,
		// 	address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
		// };
		// const ethBalance = {
		// 	eth: 123,
		// 	weth: 123,
		// 	allowance: 123
		// };
		// const orderBook = {
		// 	version: 123,
		// 	pair: 'WETH_ETH',
		// 	bids: [
		// 		{
		// 			price: 123,
		// 			balance: 123,
		// 			count: 123
		// 		}
		// 	],
		// 	asks: [
		// 		{
		// 			price: 123,
		// 			balance: 123,
		// 			count: 123
		// 		}
		// 	]
		// };
		// const handleClose = jest.fn();
		it('Test Snapshot', () => {
			// util.getExpiryTimestamp = jest.fn();
			// util.formatFixedNumber = jest.fn();
			// util.formatBalance = jest.fn();
			// util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			// util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			// const addOrder = jest.fn();
			// const setUnlimitedTokenAllowance = jest.fn();
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
	});
});
