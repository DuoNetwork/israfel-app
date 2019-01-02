/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import OrderDetailCard from './OrderDetailCard';

describe('OrderDetailCard Test', () => {
	describe('Test Snapshot', () => {
		const orders = [
			{
				type: 'test',
				status: 'test',
				updatedBy: 'test',
				processed: true,
				account: 'test',
				pair: 'test',
				orderHash: 'test',
				price: 123,
				amount: 123,
				balance: 123,
				matching: 123,
				fill: 123,
				side: 'test',
				expiry: 123,
				createdAt: 123,
				updatedAt: 123,
				initialSequence: 123,
				currentSequence: 123,
				fee: 123,
				feeAsset: 'test'
			}
		];
		const handleClose = jest.fn(() => ({}));
		it('Test Snapshot', () => {
			const wrapper = shallow(<OrderDetailCard orders={orders} handleClose={handleClose} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
