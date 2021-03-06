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
	).toBe('Order Cancelled');
	expect(
		util.getOrderTitle({
			type: 'update',
			status: 'pFill',
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
			type: 'update',
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
	).toBe('Order is Being Filled');
});

test('getOrderFullDescription', () => {
	util.formatMaturity = jest.fn(() => '1970-01-01 12:00:00');
	expect(
		util.getOrderFullDescription({
			type: 'add',
			status: 'confirmed',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'add',
			status: 'confirmed',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'update',
			status: 'matching',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 23,
			matching: 100,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'update',
			status: 'pfill',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: 'transactionHash',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 23,
			matching: 0,
			fill: 100,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'fill',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'transactionHash',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 123,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'confirmed',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'terminate',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'balance',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'matching',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getOrderFullDescription({
			type: 'terminate',
			status: 'reset',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'test',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
});

test('getOrderDescription', () => {
	expect(
		util.getOrderDescription({
			type: 'terminate',
			status: 'reset',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'bid',
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
			status: 'confirmed',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'fill',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: 'transactionHash',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 123,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'confirmed',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: 'transactionHash',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 0,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'terminate',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'balance',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'matching',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'terminate',
			status: 'reset',
			updatedBy: 'updatedBy',
			processed: true,
			transactionHash: '',
			account: 'account',
			pair: 'code1|code2',
			orderHash: 'orderHash',
			price: 123,
			amount: 123,
			balance: 123,
			matching: 123,
			fill: 123,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'update',
			status: 'matching',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 23,
			matching: 100,
			fill: 0,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
	expect(
		util.getVersionDescription({
			type: 'update',
			status: 'pfill',
			updatedBy: 'test',
			processed: true,
			transactionHash: 'test',
			account: 'test',
			pair: 'test',
			orderHash: 'test',
			price: 123,
			amount: 123,
			balance: 23,
			matching: 0,
			fill: 100,
			side: 'bid',
			expiry: 1234567890,
			createdAt: 123,
			updatedAt: 123,
			initialSequence: 123,
			currentSequence: 123,
			fee: 123,
			feeAsset: 'code1'
		})
	).toMatchSnapshot();
});

test('getMaturityDescription', () => {
	expect(
		util.getMaturityDescription({
			code: 'XXX-PPT'
		} as any)
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

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
					type: 'terminate',
					status: 'balance',
					updatedBy: 'test',
					processed: true,
					account: 'test',
					pair: 'test',
					orderHash: 'test',
					price: 123,
					amount: 123,
					balance: 123,
					matching: 123,
					fill: 123,
					side: 'bid',
					expiry: 1234567890,
					createdAt: 123,
					initialSequence: 123,
					currentSequence: 123,
					fee: 123,
					feeAsset: 'test'
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
					type: 'terminate',
					status: 'confirm',
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
					type: 'terminate',
					status: 'default',
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
					type: 'matching',
					status: 'default',
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
					type: 'matching',
					status: 'default',
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
				},
				{
					type: 'matching',
					status: 'default',
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
					type: 'default',
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
				}
			]
		})
	).toMatchSnapshot();
});

test('convertOrdersToCSV', () => {
	expect(
		util.convertOrdersToCSV({
			'WETH-ETH': [
				{
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
				}
			]
		})
	).toMatchSnapshot();
});

test('wrapCSVString', () => {
	expect(util.wrapCSVString('te,st')).toMatchSnapshot();
});

test('getEtherScanTransactionLink', () => {
	expect(util.getEtherScanTransactionLink('txHash')).toMatchSnapshot();
});

test('getEtherScanAddressLink', () => {
	expect(util.getEtherScanAddressLink('address')).toMatchSnapshot();
});

test('getEtherScanTokenLink', () => {
	expect(util.getEtherScanTokenLink('tokenAddr')).toMatchSnapshot();
	expect(util.getEtherScanTokenLink('tokenAddr', 'account')).toMatchSnapshot();
});
