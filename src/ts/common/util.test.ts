import moment from 'moment';
import util from './util';

test('formatNumber', () => {
	expect(util.formatNumber(1e-9)).toBe('0.000');
	expect(util.formatNumber(0.0123456)).toBe('0.01235');
	expect(util.formatNumber(1234.56789)).toBe('1,234.57');
	expect(util.formatNumber(123456.789)).toBe('123.5K');
	expect(util.formatNumber(1234567.89)).toBe('1.235M');
	expect(util.formatNumber(1234567890)).toBe('1.235B');
});

// test('formatExpiry', () => {
// 	expect(util.formatExpiry(false)).toBe('2019-01-05 16:00');
// 	expect(util.formatExpiry(true)).toBe('2019-01-25 16:00');
// });

// test('formatTime', () => {
// 	expect(util.formatTime(1234567890)).toBe('1970-01-15 14:26');
// });

// test('formatMaturity', () => {
// 	expect(util.formatMaturity(1234567890)).toBe('1970-01-15 14:26');
// });

test('formatPriceShort', () => {
	expect(util.formatPriceShort(0.12345)).toBe('0.123');
});

test('getOrderTitle', () => {
	expect(
		util.getOrderTitle({
			type: 'add',
			status: 'test',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 123,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toBe('Order Placed');
	expect(
		util.getOrderTitle({
			type: 'terminate',
			status: 'fill',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 123,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toBe('Order Fully Filled');
	expect(
		util.getOrderTitle({
			type: 'terminate',
			status: 'confirmed',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 123,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toBe('Order Expired');
	expect(
		util.getOrderTitle({
			type: 'terminate',
			status: 'pending',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 123,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toBe('Order Cancelled');
	expect(
		util.getOrderTitle({
			type: 'matching',
			status: 'confirmed',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 123,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toBe('Order Partially Filled');
	expect(
		util.getOrderTitle({
			type: 'matching',
			status: 'matching',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 123,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toBe('Order Filled');
});

test('formatTimeSecond', () => {
	expect(util.formatTimeSecond(1234567890)).toBe('1970-01-15 14:26:07');
});

test('getOrderFullDescription', () => {
	util.formatMaturity = jest.fn(() => '1970-01-01 12:00:00');
	expect(
		util.getOrderFullDescription({
			type: 'add',
			status: 'test',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'fill',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'confirmed',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'terminate',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'balance',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'matching',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'reset',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
});

test('getVersionDescription', () => {
	util.formatMaturity = jest.fn(() => '1970-01-01 12:00:00');
	expect(
		util.getVersionDescription({
			type: 'add',
			status: 'test',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'fill',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'confirmed',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'terminate',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'balance',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'matching',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'reset',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'update',
			status: 'reset',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'test'
		})
	).toMatchSnapshot();
});

test('getUTCNowTimestamp just now', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 1000)).toBe('just now');
});

test('getUTCNowTimestamp miniutes', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 3000000)).toBe('50 min ago');
});

test('getUTCNowTimestamp Hours', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 82800000)).toBe('23 hrs ago');
});

test('getUTCNowTimestamp Long Ago', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 260000000000000000)).toBe('long time ago');
});
