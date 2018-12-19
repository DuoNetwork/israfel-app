import * as d3 from 'd3';
import moment from 'moment';
import relayerUtil from '../../../../israfel-relayer/src/utils/util';
import * as CST from './constants';

class Util {
	public convertUpdateTime(timestamp: number): string {
		const diff = this.getUTCNowTimestamp() - timestamp;
		if (diff < 60000) return 'Just Now';
		else if (diff < 3600000) return Math.floor(diff / 60000) + ' Minutes Ago';
		else if (diff < 86400000) return Math.floor(diff / 3600000) + ' Hours Ago';
		else if (diff < 2592000000) return Math.floor(diff / 86400000) + ' Days Ago';
		else return 'Long Time Ago';
	}

	public formatFixedNumber(num: number, precision: number) {
		const decimal = precision && precision < 1 ? (precision + '').length - 2 : 0;
		const roundedNumber = Math.round(Number(num) / precision) * precision;
		return precision ? roundedNumber.toFixed(decimal) : num + '';
	}

	public formatPriceShort(num: number) {
		return d3.format('.4f')(num);
	}

	public formatBalance(num: number) {
		if (Math.abs(num) < 1e-8) return '0.000';
		return d3
			.format(Math.abs(num) > 1 ? ',.4s' : ',.4n')(num)
			.toUpperCase()
			.replace(/G/g, 'B');
	}

	public formatPercent(num: number) {
		return d3.format('%')(num);
	}

	public formatNumber(num: number) {
		if (Math.abs(num) < 1e-8) return '0.000';
		if (Math.abs(num) < 1) return d3.format(',.4n')(num);
		if (Math.abs(num) < 100000) return d3.format(',.2f')(num);
		return d3
			.format(',.4s')(num)
			.toUpperCase()
			.replace(/G/g, 'B');
	}

	public formatMaturity(maturity: number) {
		return maturity ? moment(maturity).format('YYYY-MM-DD HH:mm') : CST.TH_PERPETUAL;
	}

	public getUTCNowTimestamp = relayerUtil.getUTCNowTimestamp;

	public round = relayerUtil.round;

	public getDayExpiry = relayerUtil.getDayExpiry;

	public getMonthEndExpiry = relayerUtil.getMonthEndExpiry;

	public getExpiryTimestamp = relayerUtil.getExpiryTimestamp;
}

const util = new Util();
export default util;
