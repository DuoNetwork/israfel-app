/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import TradeCard from './TradeCard';

describe('TradeCard Test', () => {
	describe('Test Snapshot', () => {
		const token = 'test';
		const tokenInfo = {
			address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886',
			code: 'bETH',
			custodian: '0x13016f27945f3f7b39a5daae068d698e34e55491',
			denomination: 0.1,
			feeSchedules: {
				WETH: {
					minimum: 0.1,
					rate: 0
				}
			},
			precisions: { WETH: 0.000005 }
		};
		const tokenBalance = {
			balance: 123,
			allowance: 123
		};
		const ethBalance = {
			eth: 123,
			weth: 123,
			allowance: 123
		};
		const orderBook = {
			version: 123,
			pair: 'WETH_ETH',
			bids: [
				{
					price: 123,
					balance: 123,
					count: 123
				}
			],
			asks: [
				{
					price: 123,
					balance: 123,
					count: 123
				}
			]
		};
		const handleClose = jest.fn();
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<TradeCard
					account={'account'}
					token={token}
					tokenInfo={tokenInfo}
					tokenBalance={tokenBalance}
					ethBalance={ethBalance}
					orderBook={orderBook}
					ethPrice={123}
					handleClose={handleClose}
				/>
			);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
