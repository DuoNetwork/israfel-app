/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import * as CST from '../common/constants';
import Header from './Header';

describe('Header Test', () => {
	describe('User Login', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<Header
					locale={CST.LOCALE_EN}
					network={CST.NETWORK_ID_KOVAN}
					exchangePrices={{ '0x00': 123 }}
					updateLocale={() => ({})}
				/>
			);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
