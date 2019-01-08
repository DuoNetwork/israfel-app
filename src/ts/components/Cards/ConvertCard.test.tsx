/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import { duoWeb3Wrapper } from 'ts/common/duoWrapper';
import util from 'ts/common/util';
import { SButton, SInput, SSlider } from './_styled';
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
			eth: 100,
			weth: 123,
			allowance: 123
		};
		const handleClose = jest.fn();
		it('Test Snapshot', () => {
			window.open = jest.fn();
			duoWeb3Wrapper.getErc20Allowance = jest.fn();
			util.formatMaturity = jest.fn(() => '1970-01-01 08:00:00');
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
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
					wethAddress={'wethAddress'}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SInput)
				.at(1)
				.simulate('blur', { target: { value: '123456.123' } });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SInput)
				.at(0)
				.simulate('blur', { target: { value: '12.123' } });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SSlider)
				.at(1)
				.simulate('change', { target: { value: 12, limit: 123 } });
			expect(wrapper).toMatchSnapshot();
			// // wrapper.setState({ wethCreate: false });
			// // wrapper.setState({ isCreate: true });
			// wrapper
			// 	.find('li')
			// 	.at(11)
			// 	.simulate('click');
			// expect(wrapper).toMatchSnapshot();

			wrapper
				.find('li')
				.at(6)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find('button')
				.at(1)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find('li')
				.at(11)
				.simulate('click');
			wrapper.setState({ wethCreate: false });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SSlider)
				.at(0)
				.simulate('change', { target: { value: '12', limit: '123' } });
			wrapper
				.find(SSlider)
				.at(1)
				.simulate('change', { target: { value: 12, limit: 123 } });
			wrapper
				.find(SInput)
				.at(0)
				.simulate('change', { target: { value: '123456' } });
			wrapper
				.find(SInput)
				.at(0)
				.simulate('blur', { target: { value: '12.123' } });
			wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '123456' } });
			// wrapper
			// 	.find(SInput)
			// 	.at(1)
			// 	.simulate('blur', { target: { value: '123456.123' } });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(1)
				.simulate('click');
			wrapper.setProps({ info: false });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(0)
				.simulate('click');
			wrapper.simulate('keydown', { keyCode: 27 });
			expect(wrapper).toMatchSnapshot();
		});
	});
});
