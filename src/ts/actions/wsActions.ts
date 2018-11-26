import * as CST from 'ts/common/constants';
import { IStatus, IToken } from 'ts/common/types';

export function connectionUpdate(connected: boolean) {
	return {
		type: CST.AC_CONNECTION,
		value: connected
	};
}

export function infoUpdate(tokens: IToken[], status: IStatus[]) {
	return {
		type: CST.AC_INFO,
		tokens: tokens,
		status: status
	};
}
