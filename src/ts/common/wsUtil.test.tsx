import * as CST from 'ts/common/constants';
// import util from './util';
import wsUtil from './wsUtil';

test('subscribe', () => {
	wsUtil.ws = {
		send: jest.fn()
	} as any;
	wsUtil.subscribe('', '');
	expect(((wsUtil.ws as any).send as jest.Mock<Promise<void>>).mock.calls.length).toBe(0);
	wsUtil.subscribe('channel', 'marketId');
	expect(((wsUtil.ws as any).send as jest.Mock<Promise<void>>).mock.calls).toMatchSnapshot();
});

test('handleMessage empty orderBooks', () => {
	const handleOrderBooks = jest.fn();
	wsUtil.onOrderBooks(handleOrderBooks);
	wsUtil.handleMessage(
		JSON.stringify({
			status: CST.TH_SNAPSHOT,
		})
	);
	expect(handleOrderBooks.mock.calls.length).toBe(0);
});

test('handleMessage wrong orderBooks', () => {
	const handleOrderBooks = jest.fn();
	wsUtil.onOrderBooks(handleOrderBooks);
	wsUtil.handleMessage(
		JSON.stringify({
			status: CST.TH_SNAPSHOT,
			sequence: 12345,
			channel: "orderBook|pair",
			asks: [],
			bids: []
		})
	);
	expect(handleOrderBooks.mock.calls.length).toBe(0);
});

test('handleMessage addOrder', () => {
	const handleOrderBooks = jest.fn();
	wsUtil.addOrder(100, 0.09, true);
	wsUtil.handleMessage(
		JSON.stringify({
			status: CST.TH_SNAPSHOT,
			sequence: 12345,
			channel: "orderBook|pair",
			asks: [{ price: "0.007", amount: "400" }],
			bids: [{ price: "0.007", amount: "100" }]
		})
	);
	expect(handleOrderBooks.mock.calls).toMatchSnapshot();
});
