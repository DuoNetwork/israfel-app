export * from '../../../../israfel-relayer/src/common/constants';

export const AC_ACCOUNT = 'account';
export const AC_NETWORK = 'network';
// export const AC_GAS_PX = 'gasPrice';
export const AC_STATUS = 'status';
export const AC_LOCALE = 'locale';
export const AC_USER_ORDER = 'userOrder';
export const AC_USER_ORDERS = 'userOrders';
export const AC_CONNECTION = 'connection';

export const LOCALE_CN = 'CN';
export const LOCALE_EN = 'EN';
export const LOCALE_RU = 'RU';
export const LOCALE_JP = 'JP';
export interface ILocaleText {
	EN: string;
	CN: string;
	RU: string;
	JP: string;
	[key: string]: string;
}
export const TH_PLACEHOLDER = ['Target Currency', 'Base Currency'];
export const TH_CURRENCY = ['ZRX', 'ETH'];
export const TH_LOGIN = 'Admin Login';
export const TH_LOGOUT = 'Log out';
export const TH_ACCOUNT = 'Account';
export const TH_PASSWORD = 'Password';
export const TH_ACCOUNT_PH = 'Please input account';
export const TH_PASSWORD_PH = 'Please input password';
export const TH_SUBMIT = 'Submit';
export const TH_CLEAR = 'Clear';
export const TH_SUBSCRIBE = 'subscribe';
export const TH_UPDATE = 'update';
export const TH_BID = 'bid'; /************************** */
export const TH_ASK = 'ask'; /************************** */
export const TH_ORDERBOOK = 'Orderbook'; /***************** */
export const TH_LOADING = 'loading';
export const TH_TRADE = 'Trades';
export const TH_SELL = 'sell';
export const TH_BUY = 'buy';
export const TH_OPERA = 'OPERATION';
export const TH_PX = 'Price';
export const TH_AMT = 'Amount';
export const TH_STATUS = 'Status';
export const TH_ACTIONS = 'Actions';
export const TH_ADD_BIDASK = 'addBidAsk';
export const TH_EXPIRE = 'expire time';

export const TT_NETWORK_CHECK: ILocaleText = {
	[LOCALE_CN]:
		'此页面只支持' + (__KOVAN__ ? 'KOVAN' : 'MainNet') + '，请在MetaMask中选择正确的网络',
	[LOCALE_EN]:
		'This page is built for ' +
		(__KOVAN__ ? 'KOVAN' : 'MainNet') +
		', please choose the correct network in MetaMask',
	[LOCALE_JP]:
		'このページは' +
		(__KOVAN__ ? 'KOVAN' : 'MainNet') +
		'のために作られています。メタマスクに、正しいネットワークを選んでください',
	[LOCALE_RU]:
		'Данная страница предназначена для ' +
		(__KOVAN__ ? 'KOVAN' : 'MainNet') +
		', выберите необходимую сеть в MetaMask'
};
