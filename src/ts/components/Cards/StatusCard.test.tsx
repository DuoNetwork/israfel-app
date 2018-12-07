/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import StatusCard from './StatusCard';

describe('StatusCard Test', () => {
	describe('Test Snapshot', () => {
		const status = [{
			hostname: "test",
			updatedAt: 123,
			pair: "test",
			tool: "test",
			count: 123,
		}];
		it('Test Snapshot', () => {
			const wrapper = shallow(<StatusCard status={status} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
