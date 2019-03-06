import { Constants, IUserOrder, Util as CommonUtil } from '@finbook/israfel-common';
import * as d3 from 'd3';
import moment from 'moment';
import * as CST from './constants';
import { ICustodianInfo } from './types';

class Util {
	public convertUpdateTime(timestamp: number): string {
		const diff = CommonUtil.getUTCNowTimestamp() - timestamp;
		if (diff < 60000) return 'just now';
		else if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
		else if (diff < 86400000) return Math.floor(diff / 3600000) + ' hrs ago';
		else return 'long time ago';
	}

	public formatExpiry(isWeek: boolean) {
		return moment(CommonUtil.getExpiryTimestamp(isWeek)).format('YYYY-MM-DD HH:mm');
	}

	public formatTime(time: any) {
		return moment(time).format('MM-DD HH:mm:ss');
	}

	public formatTimeSecond(time: number) {
		return moment(time).format('YYYY-MM-DD HH:mm:ss');
	}

	public formatPriceShort(num: number) {
		if (num < 1) return d3.format('.3f')(num);
		return d3
			.format('.4s')(num)
			.toUpperCase()
			.replace(/G/g, 'B');
	}

	public formatStrike(num: number) {
		return d3.format('.4f')(num);
	}

	public formatBalance(num: number) {
		if (Math.abs(num) < 1e-4) return '0.000';
		return d3
			.format(Math.abs(num) > 1 ? ',.4s' : ',.4n')(num)
			.toUpperCase()
			.replace(/G/g, 'B');
	}

	public formatPercent(num: number) {
		return d3.format('.0%')(num);
	}

	public formatPercentAcc(num: number) {
		return d3.format('.2%')(num);
	}

	public formatNumber(num: number) {
		if (Math.abs(num) < 1e-4) return '0.000';
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

	public getOrderTitle(order: IUserOrder) {
		if (order.type === Constants.DB_ADD) return 'Order Placed';
		else if (order.type === Constants.DB_TERMINATE)
			if (order.status === Constants.DB_FILL) return 'Order Fully Filled';
			else if (order.status === Constants.DB_TERMINATE) return 'Order Expired';
			// order.status === Constants.DB_CONFIRMED
			else return 'Order Cancelled';
		else if (order.status === Constants.DB_MATCHING) return 'Order is Being Filled';
		// if (order.status === Constants.DB_PFILL)
		else return 'Order Partially Filled';
	}

	public getOrderFullDescription(order: IUserOrder) {
		const [code1, code2] = order.pair.split('|');
		let baseDescription = `${order.side === Constants.DB_BID ? CST.TH_BUY : CST.TH_SELL} ${
			order.amount
		} ${code1} at ${order.price} ${code2} per ${code1}.`;
		if (order.type === Constants.DB_ADD)
			return baseDescription + ` Valid till ${this.formatMaturity(order.expiry)}`;

		if (order.type === Constants.DB_TERMINATE && order.status === Constants.DB_FILL)
			return baseDescription + ' Fully filled';

		if (order.fill || order.matching) {
			const totalFill =
				order.fill + (order.type === Constants.DB_TERMINATE ? 0 : order.matching);
			baseDescription += ` ${totalFill}(${this.formatPercent(
				totalFill / order.amount
			)}) filled.`;
		}

		if (order.matching && order.type !== Constants.DB_TERMINATE)
			baseDescription += 'Pending settlement';

		if (order.type === Constants.DB_TERMINATE && order.status === Constants.DB_CONFIRMED)
			return baseDescription + ' Cancelled by user.';

		if (order.type === Constants.DB_TERMINATE && order.status === Constants.DB_TERMINATE)
			return baseDescription + ' Expired.';

		if (order.type === Constants.DB_TERMINATE && order.status === Constants.DB_BALANCE)
			return baseDescription + ` Cancelled due to insufficient balance.`;

		if (order.type === Constants.DB_TERMINATE && order.status === Constants.DB_MATCHING)
			return baseDescription + ` Cancelled due to settlement error.`;

		if (order.type === Constants.DB_TERMINATE && order.status === Constants.DB_RESET)
			return baseDescription + ` Cancelled due to custodian reset.`;

		return baseDescription;
	}

	public getOrderDescription(order: IUserOrder) {
		const [code1, code2] = order.pair.split('|');
		return `${order.side === Constants.DB_BID ? CST.TH_BUY : CST.TH_SELL} ${
			order.amount
		} ${code1} at ${order.price} ${code2} per ${code1}. Total ${util.formatBalance(
			order.fill + (order.type === Constants.DB_TERMINATE ? 0 : order.matching)
		)} filled.`;
	}

	public getVersionDescription(order: IUserOrder) {
		if (order.type === Constants.DB_ADD) return 'Order placed.';

		if (order.type === Constants.DB_UPDATE) {
			let description = `Total ${this.formatBalance(order.fill + order.matching)} filled`;
			if (order.matching) description += ', pending settlement';
			return description;
		}

		if (order.type === Constants.DB_TERMINATE)
			if (order.status === Constants.DB_TERMINATE) return 'Expired';
			else if (order.status === Constants.DB_BALANCE)
				return 'Cancelled due to insufficent balance';
			else if (order.status === Constants.DB_MATCHING)
				return 'Cancelled due to settlement error';
			else if (order.status === Constants.DB_RESET) return 'Cancelled due to custodian reset';
			else if (order.status === Constants.DB_FILL) return 'Fully filled';
			// (order.status === Constants.DB_CONFIRMED)
			else return 'Cancelled by user';
		return 'Invalid order';
	}

	public getMaturityDescription(info?: ICustodianInfo) {
		return `This contract ${
			info && info.code.endsWith('PPT')
				? 'never expires'
				: 'expires in ' +
				(info
					? Math.floor(
							(info.states.maturity - CommonUtil.getUTCNowTimestamp()) / 86400000
						).toFixed(0)
					: 0) +
				' days'
		}.`;
	}

	public convertOrdersToCSV(orders: { [pair: string]: IUserOrder[] }): string {
		const headers = [
			CST.TH_PAIR,
			CST.TH_ORDER_HASH,
			CST.TH_VERSION,
			CST.TH_TIME_UTC,
			CST.TH_SIDE,
			CST.TH_PRICE,
			CST.TH_AMOUNT,
			CST.TH_FILL,
			CST.TH_FEE,
			CST.TH_EXPIRY_UTC,
			CST.TH_STATUS,
			CST.TH_TX_HASH
		];
		let output = '';
		headers.forEach(
			(header, index) =>
				(output += this.wrapCSVString(header) + (index < headers.length - 1 ? ',' : '\n'))
		);
		const ordersByHash: { [orderHash: string]: IUserOrder[] } = {};
		for (const pair in orders)
			orders[pair].forEach(order => {
				if (!ordersByHash[order.orderHash]) ordersByHash[order.orderHash] = [];
				ordersByHash[order.orderHash].push(order);
			});

		const rows: any[][] = [];
		for (const orderHash in ordersByHash) {
			ordersByHash[orderHash].sort((a, b) => a.currentSequence - b.currentSequence);
			ordersByHash[orderHash].forEach((order, index) => {
				const row: any[] = [];
				row.push(order.createdAt);
				row.push(order.pair.replace('|', '-')); // CST.TH_PAIR,
				row.push(order.orderHash); // CST.TH_ID,
				row.push(index + 1); // CST.TH_VERSION,
				row.push(
					moment.utc(order.updatedAt || order.createdAt).format('YYYY-MM-DD HH:mm:ss')
				); // CST.TH_TIME_UTC,
				row.push(order.side === Constants.DB_BID ? CST.TH_BUY : CST.TH_SELL); // CST.TH_SIDE,
				row.push(order.price); // CST.TH_PRICE,
				row.push(order.amount); // CST.TH_AMOUNT,
				row.push(order.fill + order.matching); // CST.TH_FILL,
				row.push(order.fee + ' ' + order.feeAsset); // CST.TH_FEE,
				row.push(moment.utc(order.expiry).format('YYYY-MM-DD HH:mm:ss')); // CST.TH_EXPIRY,
				// CST.TH_STATUS,
				if (order.type === Constants.DB_TERMINATE)
					if (order.status === Constants.DB_BALANCE)
						row.push('Cancelled due to insufficent balance');
					else if (order.status === Constants.DB_MATCHING)
						row.push('Cancelled due to settlement error');
					else if (order.status === Constants.DB_RESET)
						row.push('Cancelled due to custodian reset');
					else if (order.status === Constants.DB_FILL) row.push('Fully filled');
					else if (order.status === Constants.DB_CONFIRMED) row.push('Cancelled by user');
					else row.push('Expired');
				else if (order.status === Constants.DB_MATCHING) row.push('Pending settlement');
				else row.push('Open');
				row.push(order.transactionHash || ''); // CST.TH_TX_HASH
				rows.push(row);
			});
		}

		rows.sort((a, b) => a[1].localeCompare(b[1]) || -a[0] + b[0] || -a[3] + b[3]);
		rows.forEach(row =>
			row.forEach((item, index) => {
				if (index)
					output +=
						this.wrapCSVString(item + '') + (index !== row.length - 1 ? ',' : '\n');
			})
		);

		return output;
	}

	public wrapCSVString(input: string): string {
		return ('' + input).indexOf(',') >= 0 ? '"' + input + '"' : input;
	}

	private getEtherScanLink() {
		return `https://${__ENV__ === Constants.DB_LIVE ? '' : 'kovan.'}etherscan.io`;
	}

	public getEtherScanTransactionLink(txHash: string) {
		return `${this.getEtherScanLink()}/tx/${txHash}`;
	}

	public getEtherScanTokenLink(tokenAddr: string, account: string = '') {
		return `${this.getEtherScanLink()}/token/${tokenAddr}${account ? `?a=${account}` : ''}`;
	}

	public getEtherScanAddressLink(account: string) {
		return `${this.getEtherScanLink()}/address/${account}`;
	}

	public fillZero(num: number) {
		return num < 10 ? `0${num}` : `${num}`;
	}

	public isEmptyObject(obj: object | undefined | null): boolean {
		if (!obj) return true;

		for (const prop in obj) if (obj.hasOwnProperty(prop)) return false;

		return true;
	}
}

const util = new Util();
export default util;
