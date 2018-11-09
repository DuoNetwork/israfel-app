// import { BigNumber } from '0x.js';
import moment from 'moment';
// import status from '../../../../../duo-admin/src/samples/dynamo/status.json';
// import dynamoUtil from '../../../../../duo-admin/src/utils/dynamoUtil';
import util from './util';

test('round', () => {
	expect(util.round(1.23456789012)).toBe(1.23456789);
});

test('formatNumber', () => {
	expect(util.formatNumber(1e-9)).toBe('0.000');
	expect(util.formatNumber(0.0123456)).toBe('0.01235');
	expect(util.formatNumber(1234.56789)).toBe('1,234.57');
	expect(util.formatNumber(123456.789)).toBe('123.5K');
	expect(util.formatNumber(1234567.89)).toBe('1.235M');
	expect(util.formatNumber(1234567890)).toBe('1.235B');
});

test('formatBalance', () => {
	expect(util.formatBalance(1e-9)).toBe('0.000');
	expect(util.formatBalance(0.0123456)).toBe('0.01235');
	expect(util.formatBalance(1234.56789)).toBe('1.235K');
});

test('getUTCNowTimestamp just now', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 1000)).toBe('Just Now');
});

test('getUTCNowTimestamp miniutes', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 3000000)).toBe('50 Minutes Ago');
});

test('getUTCNowTimestamp Hours', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 82800000)).toBe('23 Hours Ago');
});

test('getUTCNowTimestamp days', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 86400000)).toBe('1 Days Ago');
});

test('getUTCNowTimestamp Long Ago', () => {
	expect(util.convertUpdateTime(moment().valueOf() - 260000000000000000)).toBe('Long Time Ago');
});

test('convertSecond', () => {
	expect(util.convertSecond('12:1:1')).toEqual(43261);
});

test('operationOrder add same orderHash', () => {
	const mockOrderBook = [
		{
			account: 'text',
			pair: 'ZRX-WETH',
			orderHash: '0x00',
			price: 1,
			amount: 1,
			balance: 1,
			fill: 0,
			side: '0x00',
			createdAt: 1,
			updatedAt: 1,
			initialSequence: 1,
			currentSequence: 1,
			type: 'add',
			status: 'confirmed',
			updatedBy: 'relayer'
		}
	];
	const mockNewOrder = {
		account: 'text',
		pair: 'ZRX-WETH',
		orderHash: '0x00',
		price: 1,
		amount: 1,
		balance: 1,
		fill: 0,
		side: '0x00',
		createdAt: 1,
		updatedAt: 1,
		initialSequence: 1,
		currentSequence: 1,
		type: 'add',
		status: 'confirmed',
		updatedBy: 'relayer'
	};
	const mockResult = [
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x00',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x00',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		}
	];
	expect(util.operationOrder(mockOrderBook, mockNewOrder)).toEqual(mockResult);
});

test('operationOrder add new orderHash', () => {
	const mockOrderBook = [
		{
			account: 'text',
			pair: 'ZRX-WETH',
			orderHash: '0x00',
			price: 1,
			amount: 1,
			balance: 1,
			fill: 0,
			side: '0x00',
			createdAt: 1,
			updatedAt: 1,
			initialSequence: 1,
			currentSequence: 1,
			type: 'add',
			status: 'confirmed',
			updatedBy: 'relayer'
		}
	];
	const mockNewOrder = {
		account: 'text',
		pair: 'ZRX-WETH',
		orderHash: '0x001',
		price: 1,
		amount: 1,
		balance: 1,
		fill: 0,
		side: '0x001',
		createdAt: 1,
		updatedAt: 1,
		initialSequence: 1,
		currentSequence: 1,
		type: 'add',
		status: 'confirmed',
		updatedBy: 'relayer'
	};
	const mockResult = [
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x00',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x00',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		},
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x001',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x001',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		}
	];
	expect(util.operationOrder(mockOrderBook, mockNewOrder)).toEqual(mockResult);
});

test('operationOrder cancel new orderHash', () => {
	const mockOrderBook = [
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x001',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x00',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		},
		{
			account: 'text',
			pair: 'ZRX-WETH',
			orderHash: '0x00',
			price: 1,
			amount: 1,
			balance: 1,
			fill: 0,
			side: '0x001',
			createdAt: 1,
			updatedAt: 1,
			initialSequence: 1,
			currentSequence: 1,
			type: 'add',
			status: 'confirmed',
			updatedBy: 'relayer'
		}
	];
	const mockNewOrder = {
		account: 'text',
		pair: 'ZRX-WETH',
		orderHash: '0x001',
		price: 1,
		amount: 1,
		balance: 1,
		fill: 0,
		side: '0x001',
		createdAt: 1,
		updatedAt: 1,
		initialSequence: 1,
		currentSequence: 1,
		type: 'cancel',
		status: 'confirmed',
		updatedBy: 'relayer'
	};
	const mockResult = [
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x00',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x001',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		}
	];
	expect(util.operationOrder(mockOrderBook, mockNewOrder)).toEqual(mockResult);
});

test('operationOrder cancel new orderHash', () => {
	const mockOrderBook = [
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x001',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x00',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		},
		{
			account: 'text',
			pair: 'ZRX-WETH',
			orderHash: '0x00',
			price: 1,
			amount: 1,
			balance: 1,
			fill: 0,
			side: '0x001',
			createdAt: 1,
			updatedAt: 1,
			initialSequence: 1,
			currentSequence: 1,
			type: 'add',
			status: 'confirmed',
			updatedBy: 'relayer'
		}
	];

	const mockNewOrder = {
		account: 'text',
		pair: 'ZRX-WETH',
		orderHash: '0x001',
		price: 1,
		amount: 1,
		balance: 1,
		fill: 0,
		side: '0x001',
		createAt: 1,
		updatedAt: 1,
		initialSequence: 1,
		currentSequence: 1,
		type: 'cancel',
		status: 'pending',
		updatedBy: 'relayer'
	};

	const mockResult = [
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x001',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x00',
			status: 'pending',
			type: 'cancel',
			updatedAt: 1,
			updatedBy: 'relayer'
		},
		{
			account: 'text',
			amount: 1,
			balance: 1,
			fill: 0,
			createdAt: 1,
			currentSequence: 1,
			initialSequence: 1,
			orderHash: '0x00',
			pair: 'ZRX-WETH',
			price: 1,
			side: '0x001',
			status: 'confirmed',
			type: 'add',
			updatedAt: 1,
			updatedBy: 'relayer'
		}
	];
	expect(util.operationOrder(mockOrderBook, mockNewOrder)).toEqual(mockResult);
});
