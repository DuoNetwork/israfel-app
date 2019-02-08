/**
 * @jest-environment jsdom
 */
import { Constants } from '@finbook/israfel-common';
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
					network={Constants.NETWORK_ID_KOVAN}
					exchangePrices={{ '0x00': 123 }}
					updateLocale={() => ({})}
				/>
			);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
