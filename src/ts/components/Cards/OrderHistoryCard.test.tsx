/**
 * @jest-environment jsdom
 */

// import { shallow } from 'enzyme';
import { Popconfirm } from 'antd';
// import { Popconfirm } from 'antd';
// import { Table } from 'antd';
import { mount } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
import { SButton, SCard } from './_styled';
import OrderHistoryCard from './OrderHistoryCard';
// const Column = Table.Column;

describe('OrderHistoryCard Test', () => {
	describe('Test Snapshot', () => {
		const orderHistory = {
			'WETH|ETH': [
				{
					account: 'test',
					pair: 'WETH|ETH',
					orderHash: 'WETH|ETH',
					price: 123,
					amount: 123,
					balance: 123,
					fill: 123,
					side: 'ask',
					expiry: 123,
					createdAt: 123,
					updatedAt: 123,
					matching: 123,
					initialSequence: 123,
					currentSequence: 123,
					fee: 123,
					feeAsset: 'test',
					type: 'test',
					status: 'test',
					updatedBy: 'test',
					processed: true
				},
				{
					account: 'test',
					pair: 'WETH|ETH',
					orderHash: 'WETH|ETH123',
					price: 123,
					amount: 123,
					balance: 123,
					matching: 123,
					fill: 123,
					side: 'bid',
					expiry: 123,
					createdAt: 123,
					updatedAt: 123,
					initialSequence: 1234456,
					currentSequence: 1233,
					fee: 123,
					feeAsset: 'test',
					type: 'test',
					status: 'test',
					updatedBy: 'test',
					processed: true
				},
				{
					account: 'test',
					pair: 'WETH|ETH',
					orderHash: 'WETH|ETH',
					price: 123,
					matching: 111,
					amount: 123,
					balance: 123,
					fill: 123,
					side: 'test',
					expiry: 123,
					createdAt: 123,
					updatedAt: 123,
					initialSequence: 1234,
					currentSequence: 1234,
					fee: 123,
					feeAsset: 'test',
					type: 'terminate',
					status: 'test',
					updatedBy: 'test',
					processed: true
				}
			]
		};

		it('Test Snapshot', () => {
			util.formatTime = jest.fn(() => '1970-01-01 00:00:00');
			util.convertOrdersToCSV = jest.fn();
			util.getOrderFullDescription = jest.fn();
			util.convertOrdersToCSV = jest.fn();
			const web3PersonalSign = jest.fn();
			const deleteOrder = jest.fn();
			const notify = jest.fn();
			const wrapper = mount(
				<OrderHistoryCard
					web3PersonalSign={web3PersonalSign}
					orderHistory={orderHistory}
					account={'test'}
					deleteOrder={deleteOrder}
					notify={notify}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find(SButton)
				.at(0)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			const wrapper1 = mount(
				<OrderHistoryCard
					web3PersonalSign={web3PersonalSign}
					orderHistory={orderHistory}
					account={'test'}
					deleteOrder={deleteOrder}
					notify={notify}
				/>
			);
			wrapper1.setState({ showHistory: true });
			expect(wrapper1).toMatchSnapshot();
			wrapper1.find('.ordercard-header').simulate('click');
			wrapper1
				.find(SCard)
				.at(0)
				.find('div')
				.at(0)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper1
				.find(Popconfirm)
				.at(0)
				.prop('onConfirm');
			expect(wrapper1).toMatchSnapshot();
		});
	});
});
