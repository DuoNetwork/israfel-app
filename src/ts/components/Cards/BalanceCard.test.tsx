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
					ethBalance={ethBalance}
					tokenBalances={[{code: 'code', balance: 123, address: 'address'}]}
					totalNav={123456}
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

		it('Test Negative Input', () => {
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
					ethBalance={ethBalance}
					tokenBalances={[{code: 'code', balance: 123, address: 'address'}]}
					totalNav={123456}
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
				.simulate('change', { target: { value: '-123456' } });
			wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '-123456' } });
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

		it('Test window.open', () => {
			util.formatMaturity = jest.fn(() => '1970-01-01 08:00:00');
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			window.open = jest.fn();
			const wrapEther = jest.fn(() => Promise.resolve('txHash'));
			const unwrapEther = jest.fn(() => Promise.resolve('txHash'));
			const notify = jest.fn();
			const wrapper = shallow(
				<BalanceCard
					visible={visible}
					account={'account'}
					ethBalance={ethBalance}
					tokenBalances={[{code: 'code', balance: 123, address: 'address'}]}
					totalNav={123456}
					notify={notify}
					handleClose={handleClose}
					wrapEther={wrapEther}
					unwrapEther={unwrapEther}
				/>
			);
			expect(wrapper).toMatchSnapshot();

			wrapper
				.find('img')
				.at(0)
				.simulate('click');
			expect(window.open).toBeCalled();

			wrapper
				.find('img')
				.at(1)
				.simulate('click');
			expect(window.open).toBeCalled();
		});
	});
});
