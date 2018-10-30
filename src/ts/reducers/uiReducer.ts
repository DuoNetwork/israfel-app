import { AnyAction } from 'redux';
import * as CST from '../common/constants';
import { IUIState } from '../common/types';

const lan = navigator.language.toUpperCase();

export const initialState: IUIState = {
	locale: lan.includes(CST.LOCALE_CN)
		? CST.LOCALE_CN
		: lan.includes('JA')
			? CST.LOCALE_JP
			: lan.includes(CST.LOCALE_RU)
				? CST.LOCALE_RU
				: CST.LOCALE_EN
};

export function uiReducer(state: IUIState = initialState, action: AnyAction): IUIState {
	switch (action.type) {
		case CST.AC_LOCALE:
			return Object.assign({}, state, {
				[action.type]: action.value
			});
		default:
			return state;
	}
}
