/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
import ConvertCard from './ConvertCard';

describe('ConvertCard Test', () => {
	describe('Test Snapshot', () => {
		const custodian = '0x13016f27945f3f7b39a5daae068d698e34e55491';
		const aToken = 'WETH-ETH';
		const bToken = 'WETH-ETH';
		const info = {
			code: 'test',
			states: {
				resetState: 'test',
				alpha: 123,
				beta: 123,
				periodCoupon: 123,
				limitPeriodic: 123,
				limitUpper: 123,
				limitLower: 123,
				iterationGasThreshold: 123,
				state: 'test',
				minBalance: 123,
				totalSupplyA: 123,
				totalSupplyB: 123,
				ethCollateral: 123,
				navA: 123,
				navB: 123,
				lastPrice: 123,
				lastPriceTime: 123,
				resetPrice: 123,
				resetPriceTime: 123,
				createCommRate: 123,
				redeemCommRate: 123,
				period: 123,
				maturity: 123,
				preResetWaitingBlocks: 123,
				priceFetchCoolDown: 123,
				nextResetAddrIndex: 123,
				totalUsers: 123,
				feeBalance: 123,
				lastOperationTime: 123,
				operationCoolDown: 123
			}
		};
		const ethBalance = {
			eth: 123,
			weth: 123,
			allowance: 123
		};
		const handleClose = jest.fn();
		it('Test Snapshot', () => {
			util.formatMaturity = jest.fn(() => "1970-01-01 08:00:00");
			util.formatExpiry = jest.fn(() => "1970-01-01 19:00:00");
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const wrapper = shallow(
				<ConvertCard
					custodian={custodian}
					aToken={aToken}
					bToken={bToken}
					info={info}
					account={'account'}
					ethBalance={ethBalance}
					notify={() => ({})}
					handleClose={handleClose}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			expect(true);
		});
	});
});
