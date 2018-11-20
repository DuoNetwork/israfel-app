import * as CST from '../common/constants';
import { IUserOrder /*, VoidThunkAction*/ } from '../common/types';
// import wsUtil from '../common/wsUtil';

export function connectionUpdate(connected: boolean) {
	return {
		type: CST.AC_CONNECTION,
		value: connected
	};
}

export function userOrderUpdate(userOrder: IUserOrder) {
	return {
		type: CST.AC_USER_ORDER,
		value: userOrder
	};
}
