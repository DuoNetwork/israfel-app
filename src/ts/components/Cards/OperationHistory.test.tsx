import { Popconfirm } from 'antd';
// import { Select } from 'antd';
import { shallow } from 'enzyme';
import * as React from 'react';
import { SCard } from './_styled';
import OperationHistory from './OperationHistory';

describe('OperationHistory Test', () => {
	const orderHistory = [
		{
			account: '0x66ad9d0b933da88bbee196b2a9c0badc901c4a3a',
			amount: 2,
			balance: 1,
			fill: 0,
			createdAt: 1541143007295,
			currentSequence: 0,
			initialSequence: 0,
			orderHash: '0xc3a8341c6d29bf266943b4822b4be08a2aac7a1bf820c26737147dac0428ac6f',
			pair: 'ZRX-WETH',
			price: 0.16666666,
			side: 'ask',
			status: 'confirm',
			type: 'add',
			updatedAt: 1541143007295,
			updatedBy: 'user'
		},
		{
			account: '0x66ad9d0b933da88bbee196b2a9c0badc901c4a3a',
			amount: 2,
			balance: 1,
			fill: 0,
			createdAt: 1541143007295,
			currentSequence: 0,
			initialSequence: 0,
			orderHash: '0xc3a8341c6e29bf266943b4822b4be08a2aac7a1bf820c26737147dac0428ac6f',
			pair: 'ZRX-WETH',
			price: 0.16666666,
			side: 'ask',
			status: 'pending',
			type: 'add',
			updatedAt: 1541143007296,
			updatedBy: 'user'
		}
	];
	describe('User Login', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<OperationHistory
					locale={''}
					orderHistory={orderHistory}
					userOrder={orderHistory}
				/>
			);
			expect(wrapper).toMatchSnapshot();
			wrapper.find(SCard)
			// .find(SCardTitle)
			// .find(Select)
			.simulate('change', {target: { value: "Summary" }});
			expect(wrapper).toMatchSnapshot();
			wrapper.find(Popconfirm).at(0).simulate('confirm');
			expect(wrapper).toMatchSnapshot();
			wrapper.find('li').at(6).simulate('click');
			expect(wrapper).toMatchSnapshot();
		});
	});
});
