import { shallow } from 'enzyme';
import * as React from 'react';
import OperationHistory from './OperationHistory';

describe('OperationCard Test', () => {
	const askBidMsg = {
		amount: 123,
		price: 123,
		action: "Sell"
	}
	describe('When user search by Price and Volume', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(<OperationHistory askBidMsg={askBidMsg} locale={'test'}/>);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
