export * from '../../../../israfel-relayer/src/common/constants';
import { DB_LIVE } from '../../../../israfel-relayer/src/common/constants';
export {
	BEETHOVEN,
	MOZART,
	TENOR_M19,
	TENOR_PPT,
	CTD_TRADING,
	CTD_PRERESET
} from '../../../../duo-admin/src/common/constants';

export const AC_ACCOUNT = 'account';
export const AC_NETWORK = 'network';
// export const AC_GAS_PX = 'gasPrice';
export const AC_INFO = 'info';
export const AC_LOCALE = 'locale';
export const AC_ORDER = 'order';
export const AC_TRADE = 'trade';
export const AC_TRADE_SUB = 'tradeSubscription';
export const AC_ORDER_HISTORY = 'orderHistory';
export const AC_ORDER_SUB = 'orderSubscription';
export const AC_CONNECTION = 'connection';
export const AC_ORDER_BOOK = 'orderBook';
// export const AC_OB_SUB = 'orderBookSubscription';
export const AC_ETH_BALANCE = 'ethBalance';
export const AC_TOKEN_BALANCE = 'tokenBalance';
export const AC_CUSTODIAN = 'custodian';
export const AC_NOTIFICATION = 'notification';

export const DUMMY_PAIR = '|WETH';

export const RX_NUM = /^-?[0-9]+(\.[0-9]+)?$/;
export const RX_NUM_P = /^[0-9]+(\.[0-9]+)?$/;
export const RX_INTEGER = /^[0-9]+?$/;

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
export const TH_ETH = 'ETH';
export const TH_WETH = 'WETH';
export const TH_ALLOWANCE = 'Allowance';
export const TH_SUBMIT = 'Submit';
export const TH_RESET = 'Reset';
export const TH_APPROVE = 'Approve';
export const TH_CLEAR = 'Clear';
export const TH_ORDER = 'Order';
export const TH_ORDERS = 'Orders';
export const TH_HISTORY = 'History';
export const TH_LIVE = 'Live';
export const TH_PAST = 'Past';
export const TH_LOADING = 'Loading';
export const TH_TRADE = 'Trade';
export const TH_SELL = 'Sell';
export const TH_BUY = 'Buy';
export const TH_PX = 'Price';
export const TH_AMT = 'Amount';
export const TH_BALANCE = 'Balance';
export const TH_BALANCES = 'Balances';
export const TH_SHOW = 'Show';
export const TH_HIDE = 'Hide';
export const TH_FILL = 'Fill';
export const TH_MATCHING = 'Matching';
export const TH_SIDE = 'Side';
export const TH_FEE = 'Fee';
export const TH_STATUS = 'Status';
export const TH_ACTIONS = 'Actions';
export const TH_EXPIRY = 'Expiry';
export const TH_ORDER_HASH = 'Order Hash';
export const TH_TIME = 'Time';
export const TH_WRAP = 'Wrap';
export const TH_UNWRAP = 'Unwrap';
export const TH_PROCESS = 'Process';
export const TH_PAIR = 'Pair';
export const TH_UPDATED = 'Updated';
export const TH_INFO = 'Info';
export const TH_HOSTNAME = 'Hostname';
export const TH_COLLATERAL = 'Collateral';
export const TH_CONVERT = 'Convert';
export const TH_CREATE = 'Create';
export const TH_REDEEM = 'Redeem';
export const TH_CUSTODIAN = 'Custodian';
export const TH_MATURITY = 'Maturity';
export const TH_PERPETUAL = 'Perpetual';
export const TH_GET = 'Get';
export const TH_GET_BOTH = 'Get Both';
export const TH_PA = ' p.a.';
export const TH_X_LEV = 'x leverage';
export const TH_BID = 'Bid';
export const TH_ASK = 'Ask';
export const TH_TOTAL_SUPPLY = 'Total Supply';
export const TH_CONV_RATIO = 'Conversion Ratio';
export const TH_AMOUNT = 'Amount';
export const TH_CANCEL = 'Cancel';
export const TH_TOTAL = 'Total';
export const TH_DETAIL = 'Detail';
export const TH_NAV = 'Net Asset Value';
export const TH_PRICE = 'Price';
export const TH_TX_HASH = 'Transaction Hash';
export const TH_VERSION = 'Version';
export const TH_TIME_UTC = 'Time(UTC)';
export const TH_EXPIRY_UTC = 'Expiry(UTC)';
export const TH_INCOME = 'Income';
export const TH_LEVERAGE = 'Leverage';
export const TH_SHORT = 'Short';
export const TH_LONG = 'Long';
export const TH_TOKEN = 'Token';
export const TH_MARKET = 'Market';
export const TH_TRADES = 'Trades';

export const TT_DELETE_ORDER = 'Are you sure to delete this order?';
export const TT_NETWORK_CHECK: ILocaleText = {
	[LOCALE_CN]:
		'此页面只支持' +
		(__ENV__ === DB_LIVE ? 'MainNet' : 'KOVAN') +
		'，请在MetaMask中选择正确的网络',
	[LOCALE_EN]:
		'This page is built for ' +
		(__ENV__ === DB_LIVE ? 'MainNet' : 'KOVAN') +
		', please choose the correct network in MetaMask',
	[LOCALE_JP]:
		'このページは' +
		(__ENV__ === DB_LIVE ? 'MainNet' : 'KOVAN') +
		'のために作られています。メタマスクに、正しいネットワークを選んでください',
	[LOCALE_RU]:
		'Данная страница предназначена для ' +
		(__ENV__ === DB_LIVE ? 'MainNet' : 'KOVAN') +
		', выберите необходимую сеть в MetaMask'
};
