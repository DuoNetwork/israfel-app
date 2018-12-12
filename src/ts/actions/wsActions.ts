import * as CST from 'ts/common/constants';
import { IAcceptedPrice, IPrice, IStatus, IToken } from 'ts/common/types';

export function connectionUpdate(connected: boolean) {
	return {
		type: CST.AC_CONNECTION,
		value: connected
	};
}

export function infoUpdate(
	tokens: IToken[],
	status: IStatus[],
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] },
	exchangePrices: {[source: string]: IPrice[]}
) {
	return {
		type: CST.AC_INFO,
		tokens: tokens,
		status: status,
		acceptedPrices: acceptedPrices,
		exchangePrices: exchangePrices
	};
}
