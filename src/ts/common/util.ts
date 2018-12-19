import * as d3 from 'd3';
import moment from 'moment';
import relayerUtil from '../../../../israfel-relayer/src/utils/util';
import * as CST from './constants';
import { IUserOrder } from './types';

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

	public getOrderFullDescription(order: IUserOrder) {
		const code1 = order.pair.split('|')[0];
		let baseDescription = `${order.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL} ${
			order.amount
		} ${code1} of ${order.pair} at ${order.price}.`;
		if (order.type === CST.DB_ADD) return baseDescription;

		if (order.type === CST.DB_TERMINATE && order.status === CST.DB_FILL)
			return baseDescription + ' Filly filled';

		if (order.fill)
			baseDescription += ` ${order.fill}(${this.formatPercent(
				order.fill / order.amount
			)}) filled.`;

		if (order.type === CST.DB_TERMINATE && order.status === CST.DB_CONFIRMED)
			return (
				baseDescription +
				(order.updatedAt || 0 < order.expiry ? ' Cancelled by user.' : ' Expired.')
			);

		if (order.type === CST.DB_TERMINATE && order.status === CST.DB_BALANCE)
			return baseDescription + ` Cancelled due to insufficient balance.`;

		if (order.type === CST.DB_TERMINATE && order.status === CST.DB_MATCHING)
			return baseDescription + ` Cancelled due to matching error.`;

		if (order.type === CST.DB_UPDATE && order.matching)
			return (
				baseDescription +
				` ${order.matching}(${util.formatPercent(order.matching / order.amount)}) matching.`
			);

		return baseDescription;
	}

	public getOrderDescription(order: IUserOrder) {
		const code1 = order.pair.split('|')[0];
		return `${order.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL} ${
			order.amount
		} ${code1} of ${order.pair} at ${order.price}. Total ${order.fill} filled.`;
	}

	public getVersionDescription(order: IUserOrder) {
		if (order.type === CST.DB_ADD) return 'Order submitted.';

		if (order.type === CST.DB_UPDATE) {
			let description = '';
			if (order.fill) description = `Total ${order.fill} filled.`;
			if (order.matching) description += ` ${order.matching} matching`;
			return description;
		}

		if (order.type === CST.DB_TERMINATE)
			if (order.status === CST.DB_CONFIRMED)
				return order.updatedAt || 0 < order.expiry ? 'Cancelled by user.' : 'Expired';
			else if (order.status === CST.DB_BALANCE)
				return 'Cancelled due to insufficent balance.';
			else if (order.status === CST.DB_MATCHING) return 'Cancelled due to matching error.';
			else if (order.status === CST.DB_FILL) return 'Fully filled';
		return 'Invalid order';
	}
}

const util = new Util();
export default util;
