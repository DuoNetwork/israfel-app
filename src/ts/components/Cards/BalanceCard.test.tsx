import { shallow } from 'enzyme';
import * as React from 'react';
import BalanceCard from './BalanceCard';

describe('BalanceCard Test', () => {
	describe('Test Snapshot', () => {
		const eth = {
			eth: 123,
			weth: 123,
			allowance: 123
		};
		const tokenBalance = {
			balance: 123,
			allowance: 123
		};
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<BalanceCard
					eth={eth}
					tokenBalance={tokenBalance}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			});
	});
});
