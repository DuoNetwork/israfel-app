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

test('formatBalance', () => {
	expect(util.formatBalance(1e-9)).toBe('0.000');
	expect(util.formatBalance(0.0123456)).toBe('0.01235');
	expect(util.formatBalance(1234.56789)).toBe('1.235K');
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
