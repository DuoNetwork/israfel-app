import { shallow } from 'enzyme';
import * as React from 'react';
import Header from './Header';

describe('Header Test', () => {
	describe('User Login', () => {
		it('Test Snapshot', () => {
			const location = { pathname: "ETHUSD-Z18-USD", search: "", hash: "", state: undefined, key: "2gkutx"};
			const wrapper = shallow(<Header location={location}/>);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
