import moment from 'moment';
import * as CST from './constants';
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

test('formatMaturity', () => {
	expect(util.formatMaturity(0)).toEqual(CST.TH_PERPETUAL);
	expect(util.formatMaturity(1234567890)).toMatchSnapshot();
});

test('getExpiryTimeStamp', () => {
	util.getUTCNowTimestamp = jest.fn(() => 1544519089000);
	expect(util.getExpiryTimestamp(false)).toBe(1544601600000);
	expect(util.getExpiryTimestamp(true)).toBe(1545984000000);
	util.getUTCNowTimestamp = jest.fn(() => 1544493600000);
	expect(util.getExpiryTimestamp(false)).toBe(1544515200000);
	util.getUTCNowTimestamp = jest.fn(() => 1556668800000);
	expect(util.getExpiryTimestamp(true)).toBe(1559289600000);
	util.getUTCNowTimestamp = jest.fn(() => 1564617600000);
	expect(util.getExpiryTimestamp(true)).toBe(1567152000000);
	util.getUTCNowTimestamp = jest.fn(() => 1546041600000);
	expect(util.getExpiryTimestamp(true)).toBe(1548403200000);
	util.getUTCNowTimestamp = jest.fn(() => 1546214400000);
	expect(util.getExpiryTimestamp(true)).toBe(1548403200000);
});
