import * as CST from 'ts/common/constants';
import { IStatus, VoidThunkAction } from 'ts/common/types';
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

export function refresh(): VoidThunkAction {
	return dispatch => {
		dispatch(scanStatus());
	};
}
