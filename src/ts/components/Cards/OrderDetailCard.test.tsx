/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
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
				transactionHash: "Hash",
				fee: 123,
				feeAsset: 'test'
			}
		];
		const handleClose = jest.fn(() => ({}));
		it('Test Snapshot', () => {
			window.open = jest.fn();
			util.formatTimeSecond = jest.fn(() => "1970-01-01 00:00:00");
			const wrapper = shallow(<OrderDetailCard orders={orders} handleClose={handleClose} />);
			expect(wrapper).toMatchSnapshot();
			wrapper.find('li').at(1).simulate('click');
			expect(wrapper).toMatchSnapshot();
			expect(window.open).toBeCalled();
		});
		it('Test Snapshot', () => {
			window.open = jest.fn();
			util.formatTimeSecond = jest.fn(() => "1970-01-01 00:00:00");
			const wrapper = shallow(<OrderDetailCard orders={[]} handleClose={handleClose} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
