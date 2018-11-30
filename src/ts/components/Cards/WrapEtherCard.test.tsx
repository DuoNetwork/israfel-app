/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import web3Util from '../../common/web3Util';
import { SInput } from './_styled';
import WrapEtherCard from './WrapEtherCard';

describe('WrapEtherCard Test', () => {
	describe('Test Snapshot', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(<WrapEtherCard/>);
			expect(wrapper).toMatchSnapshot();
		});

		it('Test SInput Input', async () => {
			web3Util.wrapEther = jest.fn();
			const wrapper = shallow(<WrapEtherCard/>);
			await wrapper
				.find(SInput)
				.at(0)
				.simulate('change', { target: { value: '123456' } });
			expect(wrapper.state('amount')).toBe('123456');
			wrapper
				.find('button')
				.at(0)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
			wrapper
				.find('button')
				.at(1)
				.simulate('click');
			expect(wrapper).toMatchSnapshot();
		});
	});
});
