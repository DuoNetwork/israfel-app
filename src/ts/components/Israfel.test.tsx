/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import Israfel from './Israfel';

describe('Israfel Test', () => {
	describe('User Login', () => {
		const token = [{
			address: 'test',
			code: 'test',
			denomination: 123,
			precisions: {
				['test']: 123,
			},
			feeSchedules: {
				['test']: {
					asset: 'test',
					rate: 123,
					minimum: 123
				}
			},
			maturity: 123,
		}];
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<Israfel tokens={token} />
			);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
