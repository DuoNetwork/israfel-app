/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import Israfel from './Israfel';

describe('Israfel Test', () => {
	describe('Israfel Test', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(<Israfel />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
