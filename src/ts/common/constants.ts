export * from '../../../../israfel-relayer/src/common/constants';

export const AC_ACCOUNT = 'account';
export const AC_NETWORK = 'network';
// export const AC_GAS_PX = 'gasPrice';
export const AC_STATUS = 'status';
export const AC_TOKENS = 'tokens';
export const AC_LOCALE = 'locale';
export const AC_USER_ORDER = 'updateOrder';
export const AC_USER_ORDER_LIST = 'userOrderList';
export const AC_CONNECTION = 'connection';
export const AC_OB_UPDATE = 'orderBookUpdate';
export const AC_OB_SNAPSHOT = 'orderBookSnapshot';
export const AC_OB_SUB = 'orderBookSubscription';
export const AC_UO_SUB = 'userOrderSubscription';

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
export const TH_SUBMIT = 'Submit';
export const TH_CLEAR = 'Clear';
export const TH_ORDER = 'Order';
export const TH_HISTORY = 'History'
export const TH_LOADING = 'Loading';
export const TH_TRADE = 'Trades';
export const TH_SELL = 'Sell';
export const TH_BUY = 'Buy';
export const TH_PX = 'Price';
export const TH_AMT = 'Amount';
export const TH_BALANCE = 'Balance';
export const TH_FILL = 'Fill';
export const TH_SIDE = 'Side';
export const TH_STATUS = 'Status';
export const TH_ACTIONS = 'Actions';
export const TH_EXPIRY = 'Expiry';
export const TH_ORDER_HASH = 'Order Hash';
export const TH_TIME = 'Time';
export const TH_WRAP = 'Wrap';
export const TH_UNWRAP = 'Unwrap';
export const TH_PROCESS = 'Process';
export const TH_UPDATED = 'Updated';
export const TH_INFO = 'Info';
export const TH_HOSTNAME = 'Hostname';

export const TT_DELETE_ORDER = 'Are you sure to delete this order?';
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
