import { DatePicker, Select } from 'antd';
import { shallow } from 'enzyme';
import moment from 'moment';
import * as React from 'react';
import util from '../../common/util';
import wsUtil from '../../common/wsUtil';
import { SInput } from './_styled';
import OperationCard from './OperationCard';

describe('OperationCard Test', () => {
	describe('When user search by Price and Volume', () => {
		util.getUTCNowTimestamp = jest.fn(() => 1234567890);
		it('Test Snapshot', () => {
			const wrapper = shallow(<OperationCard />);
			wrapper.setState({ expireTime: '1541721600000' });
			jest.useFakeTimers();
			expect(wrapper).toMatchSnapshot();
		});
		// });

		it('Test SInput Input', async () => {
			const wrapper = shallow(<OperationCard />);
			wrapper.setState({ expireTime: '1541721600000' });
			jest.useFakeTimers();
			await wrapper
				.find(SInput)
				.at(0)
				.simulate('change', {
					target: {
						value: '1'
					}
				});
			await wrapper
				.find(SInput)
				.at(0)
				.simulate('blur');
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('change', {
					target: {
						value: '2'
					}
				});
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('blur');
			expect(wrapper.state('baseCurrency')).toBe('2');
			expect(wrapper.state('targetCurrency')).toBe('1');
			expect(wrapper.state('price')).toBe('0.5');
			setTimeout(() => {
				expect(
					wrapper
						.find('div')
						.at(4)
						.find('li')
						.at(4)
						.find('.description')
				).toBe('Sell 1 with 1');
			}, 1500);
			await wrapper
				.find(SInput)
				.at(2)
				.simulate('change', {
					target: {
						value: '2'
					}
				});
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('blur');
			expect(wrapper.state('baseCurrency')).toBe('2');
			expect(wrapper.state('targetCurrency')).toBe('4');
			expect(wrapper.state('price')).toBe('2');
			setTimeout(() => {
				expect(
					wrapper
						.find('div')
						.at(4)
						.find('li')
						.at(4)
						.find('.description')
				).toBe('Sell 2 with 1');
			}, 100);
			wsUtil.addOrder = jest.fn();
			wrapper
				.find('button')
				.at(2)
				.simulate('click');
			expect(wsUtil.addOrder).toHaveBeenCalled();
		});

		it('Expire Time Input ', async () => {
			const wrapper = shallow(<OperationCard />);
			wrapper.setState({ expireTime: '1541721600000' });
			jest.useFakeTimers();
			await wrapper
				.find(DatePicker)
				.at(0)
				.simulate('change', {
					target: {
						value: {
							time: moment(1234567890)
						}
					}
				});
			setTimeout(() => {
				expect(
					wrapper
						.find('div')
						.at(4)
						.find('li')
						.at(4)
						.find('.expireTime')
				).toBe('');
			}, 1500);
		});

		it('Test SInput Input', async () => {
			const wrapper = shallow(<OperationCard />);
			wrapper.setState({ expireTime: '1541721600000' });
			wrapper
				.find('button')
				.at(0)
				.simulate('click');
			jest.useFakeTimers();
			await wrapper
				.find(SInput)
				.at(0)
				.simulate('change', {
					target: {
						value: '1'
					}
				});
			await wrapper
				.find(SInput)
				.at(0)
				.simulate('blur');
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('change', {
					target: {
						value: '2'
					}
				});
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('blur');
			await wrapper
				.find(Select)
				.at(1)
				.simulate('select', {
					target: {
						value: 1
					}
				});
			await wrapper
				.find(Select)
				.at(0)
				.simulate('select', { target: { value: 0 } });
			expect(wrapper.state('baseCurrency')).toBe('2');
			expect(wrapper.state('targetCurrency')).toBe('1');
			expect(wrapper.state('price')).toBe('0.5');
			setTimeout(() => {
				expect(
					wrapper
						.find('div')
						.at(4)
						.find('li')
						.at(4)
						.find('.description')
				).toBe('Buy 1 with 2');
			}, 1500);
			await wrapper
				.find(SInput)
				.at(2)
				.simulate('change', {
					target: {
						value: '2'
					}
				});
			await wrapper
				.find(SInput)
				.at(2)
				.simulate('blur');
			expect(wrapper.state('baseCurrency')).toBe('2');
			expect(wrapper.state('targetCurrency')).toBe('4');
			expect(wrapper.state('price')).toBe('2');
			setTimeout(() => {
				expect(
					wrapper
						.find('div')
						.at(4)
						.find('li')
						.at(4)
						.find('.description')
				).toBe('Buy 4 with 2');
			}, 1500);
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '1' } });
			wrapper
				.find('button')
				.at(1)
				.simulate('click');
			expect(wrapper.state('price')).toBe('');
			expect(wrapper.state('baseCurrency')).toBe('');
			expect(wrapper.state('targetCurrency')).toBe('');
		});

		it('Sell Clear', async () => {
			const wrapper = shallow(<OperationCard />);
			jest.useFakeTimers();
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '1' } });
			wrapper
				.find('button')
				.at(3)
				.simulate('click');
			expect(wrapper.state('baseCurrency')).toBe('');
			expect(wrapper.state('targetCurrency')).toBe('');
			expect(wrapper.state('price')).toBe('');
		});
	});
});
