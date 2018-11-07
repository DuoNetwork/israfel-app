import { TimePicker } from 'antd';
import { shallow } from 'enzyme';
import * as React from 'react';
import moment = require('../../../../../israfel-relayer/node_modules/moment/moment');
import wsUtil from '../../common/wsUtil';
import { SInput } from './_styled';
import OperationCard from './OperationCard';

describe('OperationCard Test', () => {
	describe('When user search by Price and Volume', () => {
		it('Test Snapshot', () => {
			const wrapper = shallow(<OperationCard />);
			jest.useFakeTimers();
			expect(wrapper).toMatchSnapshot();
		});
		// });

		it('Test SInput Input', async () => {
			const wrapper = shallow(<OperationCard />);
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

		it(' Expire Time Input ', async () => {
			const wrapper = shallow(<OperationCard />);
			jest.useFakeTimers();
			await wrapper
				.find(TimePicker)
				.at(0)
				.simulate('change', {
					target: {
						value: {
							time: moment.now,
							timeString: '08:00:00'
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
				).toBe('Buy 4 with 2');
			}, 1500);
			await wrapper
				.find(SInput)
				.at(1)
				.simulate('change', { target: { value: '1' } });
			wrapper.find('button').at(1).simulate('click');
			expect(wrapper.state('price')).toBe('0');
			expect(wrapper.state('baseCurrency')).toBe('0');
			expect(wrapper.state('targetCurrency')).toBe('0');
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
			expect(wrapper.state('baseCurrency')).toBe('0');
			expect(wrapper.state('targetCurrency')).toBe('0');
			expect(wrapper.state('price')).toBe('0');
		});
	});
});

// 		it('Test SInput Input', async () => {
// 			const wrapper = shallow(<OperationCard />);
// 			wrapper
// 				.find('button')
// 				.at(0)
// 				.simulate('click');
// 			jest.useFakeTimers();
// 			await wrapper
// 				.find(SInput)
// 				.at(0)
// 				.simulate('change', { target: { value: '6506.88' } });
// 			await wrapper
// 				.find(SInput)
// 				.at(0)
// 				.simulate('blur');
// 			await wrapper
// 				.find(SInput)
// 				.at(1)
// 				.simulate('change', { target: { value: '6556' } });
// 			await wrapper
// 				.find(SInput)
// 				.at(1)
// 				.simulate('blur');
// 			wrapper
// 				.find('button')
// 				.at(2)
// 				.simulate('click');
// 			expect(wrapper.state('amount')).toBe('6556');
// 			expect(wrapper.state('price')).toBe('6506.88');
// 			setTimeout(() => {
// 				expect(
// 					wrapper
// 						.find('div')
// 						.at(4)
// 						.find('li')
// 						.at(4)
// 						.find('.description')
// 				).toBe('Buy 6556 at price 6506.88');
// 				// expect(submitOrdersMock).toHaveBeenCalled();
// 				expect(wrapper.state('description')).toBe('Buy 6556 at price 6506.88');
// 			}, 1500);
// 		});

// 		it('Sell Clear', async () => {
// 			const wrapper = shallow(<OperationCard />);
// 			jest.useFakeTimers();
// 			await wrapper
// 				.find(SInput)
// 				.at(1)
// 				.simulate('change', { target: { value: '6556' } });
// 			await wrapper
// 				.find('button')
// 				.at(1)
// 				.simulate('click');
// 			expect(wrapper.state('amount')).toBe('0');
// 			expect(wrapper.state('price')).toBe('0');
// 			expect(wrapper.state('description')).toBe('');
// 			setTimeout(() => {
// 				expect(
// 					wrapper
// 						.find('div')
// 						.at(4)
// 						.find('li')
// 						.at(4)
// 						.find('.description')
// 				).toBe('Sell 0 at price 0');
// 			}, 500);
// 		});

// 		it('Buy Clear', async () => {
// 			const wrapper = shallow(<OperationCard />);
// 			wrapper
// 				.find('button')
// 				.at(0)
// 				.simulate('click');
// 			jest.useFakeTimers();
// 			await wrapper
// 				.find(SInput)
// 				.at(1)
// 				.simulate('change', { target: { value: '6556' } });
// 			await wrapper
// 				.find('button')
// 				.at(1)
// 				.simulate('click');
// 			await wrapper
// 				.find('button')
// 				.at(3)
// 				.simulate('click');
// 			wrapper
// 				.find('button')
// 				.at(2)
// 				.simulate('click');
// 			expect(wrapper.state('amount')).toBe('0');
// 			expect(wrapper.state('price')).toBe('0');
// 			expect(wrapper.state('description')).toBe('');
// 			setTimeout(() => {
// 				expect(
// 					wrapper
// 						.find('div')
// 						.at(4)
// 						.find('li')
// 						.at(4)
// 						.find('.description')
// 				).toBe('Buy 0 at price 0');
// 				// expect(submitOrdersMock).toHaveBeenCalled();
// 			}, 500);
// 		});
// 	});
// });
