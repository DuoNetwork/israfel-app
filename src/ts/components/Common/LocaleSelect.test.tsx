/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import LocaleSelect from './LocaleSelect';

describe('LocaleSelect Test', () => {
	const locale = 'EN';
	const onSelect = jest.fn();

	describe('Test Snapshot', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(< LocaleSelect locale={locale} onSelect={onSelect} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
