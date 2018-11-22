import { shallow } from 'enzyme';
import * as React from 'react';
import * as CST from '../common/constants';
import Header from './Header';

describe('Header Test', () => {
	describe('User Login', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<Header
					location={{ pathname: 'path' }}
					locale={CST.LOCALE_EN}
					network={CST.NETWORK_ID_KOVAN}
					updateLocale={() => ({})}
				/>
			);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
