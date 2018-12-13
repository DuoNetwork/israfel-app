/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import BalanceInfo from './BalanceInfo';

describe('BalanceInfo Test', () => {
	describe('Test Snapshot', () => {
		const icon = 'test';
		const name = 'test';
		const value = 12;
		const mobile = true;
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<BalanceInfo icon={icon} name={name} value={value} mobile={mobile} />
			);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
