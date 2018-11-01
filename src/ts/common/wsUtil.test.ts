import * as CST from 'ts/common/constants';
import wsUtil from './wsUtil';

test('handleMessage no channel', () => {
	const handleOrderUpdate = jest.fn();
	const handleOrderError = jest.fn();
	wsUtil.onOrderUpdate(handleOrderUpdate);
	wsUtil.onOrderError(handleOrderError);
	wsUtil.handleMessage(JSON.stringify({}));
	expect(handleOrderUpdate).not.toBeCalled();
	expect(handleOrderError).not.toBeCalled();
});

test('handleMessage order error', () => {
	const handleOrderUpdate = jest.fn();
	const handleOrderError = jest.fn();
	wsUtil.onOrderUpdate(handleOrderUpdate);
	wsUtil.onOrderError(handleOrderError);
	wsUtil.handleMessage(
		JSON.stringify({
			status: 'not ok',
			channel: CST.DB_ORDERS,
			method: 'method',
			orderHash: '0xOrderHash'
		})
	);
	expect(handleOrderUpdate).not.toBeCalled();
	expect(handleOrderError.mock.calls).toMatchSnapshot();
});

test('handleMessage order ok', () => {
	const handleOrderUpdate = jest.fn();
	const handleOrderError = jest.fn();
	wsUtil.onOrderUpdate(handleOrderUpdate);
	wsUtil.onOrderError(handleOrderError);
	wsUtil.handleMessage(
		JSON.stringify({
			status: CST.WS_OK,
			channel: CST.DB_ORDERS,
			method: 'method',
			userOrder: {
				test: 'test'
			}
		})
	);
	expect(handleOrderUpdate.mock.calls).toMatchSnapshot();
	expect(handleOrderError).not.toBeCalled();
});
