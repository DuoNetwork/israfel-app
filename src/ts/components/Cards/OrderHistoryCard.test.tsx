/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import OrderHistoryCard from './OrderHistoryCard';

describe('OrderHistoryCard Test', () => {
	describe('Test Snapshot', () => {
		const orderHistory = [
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
		];
		const locale = 'EN';

		it('Test Snapshot', () => {
			const wrapper = shallow(<OrderHistoryCard orderHistory={orderHistory} locale={locale} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});