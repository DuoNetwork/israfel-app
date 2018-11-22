// import * as CST from './constants';
// import { ICustodianPrice, IPriceStatus, ISourceData, IStatus } from './types';
import * as d3 from 'd3';
import moment from 'moment';
// import * as CST from './constants';

class Util {
	public convertUpdateTime(timestamp: number): string {
		const diff = this.getUTCNowTimestamp() - timestamp;
		if (diff < 60000) return 'Just Now';
		else if (diff < 3600000) return Math.floor(diff / 60000) + ' Minutes Ago';
		else if (diff < 86400000) return Math.floor(diff / 3600000) + ' Hours Ago';
		else if (diff < 2592000000) return Math.floor(diff / 86400000) + ' Days Ago';
		else return 'Long Time Ago';
	}

	public convertSecond(time: string) {
		const index = time.split(':');
		let seconds = 0;
		for (let i = 0; i < index.length; i++) {
			seconds *= 60;
			seconds += Number(index[i]);
		}
		return seconds;
	}

	public getUTCNowTimestamp() {
		return moment().valueOf();
	}

	public round(num: number) {
		return +(Math.floor((num + 'e+8') as any) + 'e-8');
	}

	public range(start: number, end: number) {
		const subArray = Array.apply(null, { length: end }).map(Number.call, Number);
		return subArray.slice(start, end);
	}

	public formatBalance(num: number) {
		if (Math.abs(num) < 1e-8) return '0.000';
		return d3
			.format(Math.abs(num) > 1 ? ',.4s' : ',.4n')(num)
			.toUpperCase()
			.replace(/G/g, 'B');
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
}

const util = new Util();
export default util;
