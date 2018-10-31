import * as CST from 'ts/common/constants';
import { IStatus, IUserOrder, VoidThunkAction } from 'ts/common/types';
import util from 'ts/common/util';
import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';

export function statusUpdate(status: IStatus[]) {
	return {
		type: CST.AC_STATUS,
		value: status
	};
}

export function scanStatus(): VoidThunkAction {
	return async dispatch => {
		const states = await dynamoUtil.scanStatus();
		dispatch(statusUpdate(states));
	};
}

export function userOrdersUpdte(userOrders: IUserOrder[]) {
	return {
		type: CST.AC_USER_ORDERS,
		value: userOrders
	};
}

export function getUserOrders(): VoidThunkAction {
	return async (dispatch, getState) =>
		dispatch(
			userOrdersUpdte(
				await dynamoUtil.getUserOrders(
					getState().web3.account,
					util.getUTCNowTimestamp() - 30 * 86400000
				)
			)
		);
}

export function refresh(): VoidThunkAction {
	return dispatch => {
		dispatch(scanStatus())
		dispatch(getUserOrders());
	}
}
