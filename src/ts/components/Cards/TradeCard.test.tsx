/**
 * @jest-environment jsdom
 */
import { Radio } from 'antd';
import { shallow } from 'enzyme';
// import { mount } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
import { SButton, SInput, SSlider } from './_styled';
import TradeCard from './TradeCard';
const RadioGroup = Radio.Group;

describe('TradeCard Test', () => {
	describe('Test Snapshot', () => {
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
			allowance: 123,
			address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
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
			util.getExpiryTimestamp = jest.fn();
			util.formatFixedNumber = jest.fn();
			util.formatBalance = jest.fn();
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const addOrder = jest.fn();
			const setUnlimitedTokenAllowance = jest.fn();
			const wrapper = shallow(
				<TradeCard
					account={'account'}
					token={'aETH'}
					tokenInfo={tokenInfo}
					tokenBalance={tokenBalance}
					ethBalance={ethBalance}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			const wrapper1 = shallow(
				<TradeCard
					account={'account'}
					token={'bToken'}
					tokenInfo={tokenInfo}
					tokenBalance={tokenBalance}
					ethBalance={ethBalance}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper1).toMatchSnapshot();
			const wrapper2 = shallow(
				<TradeCard
					account={'account'}
					token={'sToken'}
					tokenInfo={tokenInfo}
					tokenBalance={tokenBalance}
					ethBalance={ethBalance}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper2).toMatchSnapshot();
			const wrapper3 = shallow(
				<TradeCard
					account={'account'}
					token={'dETH'}
					tokenInfo={tokenInfo}
					tokenBalance={tokenBalance}
					ethBalance={ethBalance}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper3).toMatchSnapshot();
			wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '123456' } });
			wrapper
				.find(SInput)
				.at(1)
				.simulate('blur', { target: { value: '123456' } });
			wrapper
				.find(SInput)
				.at(1)
				.simulate('blur', { target: { value: '-123456' } });
			wrapper
				.find(SInput)
				.at(0)
				.simulate('change', { target: { value: '123456' } });
			wrapper
				.find(SInput)
				.at(0)
				.simulate('blur', { target: { value: '123456' } });
			wrapper
				.find(SInput)
				.at(0)
				.simulate('blur', { target: { value: '-123456' } });
			expect(wrapper).toMatchSnapshot();
			wrapper.simulate('keypress', { keyCode: 27 });
			expect(wrapper).toMatchSnapshot();
			wrapper.setState({ approving: false });
			wrapper
				.find(SButton)
				.at(0)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
		});

		it('Test Snapshot', () => {
			Math.max = jest.fn(() => 1);
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const addOrder = jest.fn();
			const setUnlimitedTokenAllowance = jest.fn();
			const wrapper = shallow(
				<TradeCard
					account={'account'}
					token={'aETH'}
					tokenBalance={tokenBalance}
					ethBalance={ethBalance}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SSlider)
				.at(0)
				.simulate('change', { target: { value: '123456' } });
			wrapper
				.find(RadioGroup)
				.at(0)
				.simulate('change', { target: { value: '123456' } });
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find('button')
				.at(0)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();

			wrapper
				.find('button')
				.at(1)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(1)
				.simulate('click');

			wrapper.setProps({ token: '' });
			expect(wrapper).toMatchSnapshot();
		});

		it('Approve', () => {
			Math.max = jest.fn(() => 1);
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const addOrder = jest.fn();
			const setUnlimitedTokenAllowance = jest.fn();
			const wrapper = shallow(
				<TradeCard
					account={'account'}
					token={'aETH'}
					tokenBalance={tokenBalance}
					ethBalance={{
						eth: 123,
						weth: 123,
						allowance: 0
					}}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(0)
				.simulate('click');
		});

		it('getDerivedStateFromProps', () => {
			Math.max = jest.fn(() => 1);
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const addOrder = jest.fn();
			const setUnlimitedTokenAllowance = jest.fn();
			const wrapper = shallow(
				<TradeCard
					account={'account'}
					token={'aETH'}
					tokenBalance={tokenBalance}
					ethBalance={{ eth: 123, weth: 123, allowance: 0 }}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper.setProps({ account: 'default ' });
			wrapper.setProps({
				tokenBalance: {
					balance: 123,
					allowance: 123,
					address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
				}
			});
			expect(wrapper).toMatchSnapshot();
		});

		it('limit', () => {
			Math.max = jest.fn(() => 1);
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			util.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const addOrder = jest.fn();
			const setUnlimitedTokenAllowance = jest.fn();
			const wrapper = shallow(
				<TradeCard
					account={'account'}
					token={'aETH'}
					tokenInfo={{
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886',
						code: 'bETH',
						custodian: '0x13016f27945f3f7b39a5daae068d698e34e55491',
						denomination: 0.1,
						feeSchedules: { WETH: { rate: 123, minimum: 123, asset: 'test' } },
						precisions: { WETH: 0.000005 }
					}}
					tokenBalance={tokenBalance}
					ethBalance={{ eth: 0, weth: 0, allowance: 0 }}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper.setState({ isBid: false });
			expect(wrapper).toMatchSnapshot();

			const wrapper1 = shallow(
				<TradeCard
					account={'account'}
					token={'aETH'}
					tokenInfo={{
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886',
						code: 'bETH',
						custodian: '0x13016f27945f3f7b39a5daae068d698e34e55491',
						denomination: 0.1,
						feeSchedules: {
							WETH: {
								rate: 123,
								minimum: 123
							}
						},
						precisions: { WETH: 0.000005 }
					}}
					tokenBalance={tokenBalance}
					ethBalance={{ eth: 0, weth: 0, allowance: 0 }}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper1).toMatchSnapshot();

			wrapper1.setState({ isBid: false });
			expect(wrapper1).toMatchSnapshot();

			const wrapper2 = shallow(
				<TradeCard
					account={'account'}
					token={'aETH-ETH'}
					tokenInfo={{
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886',
						code: 'bETH',
						custodian: '0x13016f27945f3f7b39a5daae068d698e34e55491',
						denomination: 0.1,
						feeSchedules: { WETH: { rate: 123, minimum: 123, asset: 'test' } },
						precisions: { WETH: 0.000005 }
					}}
					tokenBalance={tokenBalance}
					ethBalance={{ eth: 0, weth: 0, allowance: 0 }}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper2).toMatchSnapshot();
			const wrapper3 = shallow(
				<TradeCard
					account={'account'}
					token={'aETH-ETH'}
					tokenInfo={{
						address: '0x8a3beca74e0e737460bde45a09594a8d7d8c9886',
						code: 'bETH',
						custodian: '0x13016f27945f3f7b39a5daae068d698e34e55491',
						denomination: 0.1,
						feeSchedules: {},
						precisions: { WETH: 0.000005 }
					}}
					tokenBalance={tokenBalance}
					ethBalance={{ eth: 0, weth: 0, allowance: 0 }}
					orderBook={orderBook}
					ethPrice={123}
					navInEth={1}
					navUpdatedAt={1234567890}
					notify={() => ({})}
					interestOrLeverage={1}
					handleClose={handleClose}
					setUnlimitedTokenAllowance={setUnlimitedTokenAllowance}
					addOrder={addOrder}
				/>
			);
			expect(wrapper3).toMatchSnapshot();
		});
	});
});
