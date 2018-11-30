/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import OrderBookCard from './OrderBookCard';

describe('OrderBookCard Test', () => {
	describe('Test Snapshot', () => {
		const orderBook = {
			asks: [
				{price: 0.007, amount: 30, count: 3},
				{price: 0.007, amount: 4, count: 1}
			],
			bids: [
				{price: 0.008, amount: 0, count: 1},
				{price: 0.007, amount: 4, count: 1}
			],
			pair: "B-PPT-I0|WETH",
			version: 1543479830843
		};

		const orderBook1 = {
			asks: [],
			bids: [],
			pair: "B-PPT-I0|WETH",
			version: 1543479830843
		};

		it('Test Snapshot', () => {
			const wrapper = shallow(
				<OrderBookCard
					OrderBookSnapshot={orderBook}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			const wrapper1 = shallow(
				<OrderBookCard
					OrderBookSnapshot={orderBook1}
				/>
			);
			expect(wrapper1).toMatchSnapshot();
			});
	});
});
