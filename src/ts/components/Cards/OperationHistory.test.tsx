import { shallow } from 'enzyme';
import * as React from 'react';
import OperationHistory from './OperationHistory';

describe('OperationCard Test', () => {
	const askBidMsg = {
		account: "0xaa8625f59a520dd8b7070a7874f2a67b23eb0c16",
		amount: 12000000000000000000,
		currentSequence: 9,
		initialSequence: 9,
		orderHash: "0x415f968ca04cc954dd2bb20cf5e34ff914509166b1f43c1485577e195538ccfa",
		pair: "ZRX-WETH",
		price: 1,
		side: "ask",
		status: "confirmed",
		type: "add",
		updatedBy: "relayer"
	}
	describe('When user search by Price and Volume', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(<OperationHistory askBidMsg={askBidMsg} locale={'test'}/>);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
