/**
 * @jest-environment jsdom
 */
// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import { Util as CommonUtil } from '@finbook/israfel-common';
import { shallow } from 'enzyme';
import * as React from 'react';
import util from 'ts/common/util';
import DummyCustodianCard from './DummyCustodianCard';

describe('DummyCustodianCard Test', () => {
	describe('Test Snapshot', () => {
		const type = "test";
		const margin = "test";
		it('Test Snapshot', () => {
			util.formatMaturity = jest.fn(() => '1970-01-01 08:00:00');
			util.formatExpiry = jest.fn(() => '1970-01-01 19:00:00');
			CommonUtil.getUTCNowTimestamp = jest.fn(() => 1234567890);
			const wrapper = shallow(
				<DummyCustodianCard
					type={type}
					margin={margin}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			});
	});
});
