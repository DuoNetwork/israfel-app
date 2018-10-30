import * as CST from '../common/constants';

export function localeUpdate(locale: string) {
	return {
		type: CST.AC_LOCALE,
		value: locale
	};
}
