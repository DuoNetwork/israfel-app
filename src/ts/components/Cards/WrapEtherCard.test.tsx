/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import WrapEtherCard from './WrapEtherCard';

describe('WrapEtherCard Test', () => {
	describe('Test Snapshot', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<WrapEtherCard />
			);
			expect(wrapper).toMatchSnapshot();
			});
		});
});
