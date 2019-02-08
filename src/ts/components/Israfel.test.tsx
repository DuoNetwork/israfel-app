/**
 * @jest-environment jsdom
 */
// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
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
