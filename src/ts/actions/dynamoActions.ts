import dynamoUtil from '../../../../israfel-relayer/src/utils/dynamoUtil';
import * as CST from '../common/constants';
import { VoidThunkAction } from '../common/types';

export function statusUpdate(status: object) {
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
