import * as CST from 'ts/common/constants';

export function authUpdate(signedIn: boolean) {
	return {
		type: CST.AC_AUTH,
		[CST.AC_AUTH]: signedIn
	};
}
