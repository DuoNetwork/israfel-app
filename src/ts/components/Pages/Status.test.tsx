/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import Status from './Status';

describe('Status Test', () => {
	describe('User Login', () => {
		it('Test Snapshot', () => {
			const status = [
				{
					hostname: 'test',
					updatedAt: 123,
					pair: 'test',
					tool: 'test',
					count: 123
				}
			];
			const wrapper = shallow(<Status status={status} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
