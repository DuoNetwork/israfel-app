/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import moment from 'moment';
import * as React from 'react';
import OrderHistoryCard from './OrderHistoryCard';

describe('OrderHistoryCard Test', () => {
	describe('Test Snapshot', () => {
		const orderHistory = {
			'WETH|ETH': [
				{
					account: 'test',
					pair: 'test',
					orderHash: 'test',
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
					pair: 'test',
					orderHash: 'tesst123',
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
					pair: 'test',
					orderHash: 'test',
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
					type: 'test',
					status: 'test',
					updatedBy: 'test',
					processed: true
				}
			]
		};

		it('Test Snapshot', () => {
			moment().format = jest.fn(() => "1970-01-01 07:30");
			const wrapper = shallow(
				<OrderHistoryCard orderHistory={orderHistory} account={'test'} />
			);
			expect(wrapper).toMatchSnapshot();
			});
	});
});
