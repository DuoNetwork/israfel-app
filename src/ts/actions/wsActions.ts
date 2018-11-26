import * as CST from 'ts/common/constants';
import { IStatus, IToken } from 'ts/common/types';

export function connectionUpdate(connected: boolean) {
	return {
		type: CST.AC_CONNECTION,
		value: connected
	};
}

export function tokensUpdate(tokens: IToken[]) {
	return {
		type: CST.AC_TOKENS,
		value: tokens
	};
}

export function statusUpdate(status: IStatus[]) {
	return {
		type: CST.AC_STATUS,
		value: status
	};
}
