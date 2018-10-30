export const AC_AUTH = 'auth';

export const TH_LOGIN = 'Admin Login';
export const TH_LOGOUT = 'Log out';
export const TH_ACCOUNT = 'Account';
export const TH_PASSWORD = 'Password';
export const TH_ACCOUNT_PH = 'Please input account';
export const TH_PASSWORD_PH = 'Please input password';
export const TH_SUBMIT = 'Submit';
export const TH_CLEAR = 'Clear';
export const PENDING_TX_TIMEOUT = 1200000;
export const RELAYER_WS_URL = 'ws://localhost:8080';
export const TH_SUBSCRIBE = 'subscribe';
export const TH_UPDATE = 'update';
export const TH_BID = 'bid'; /************************** */
export const TH_ASK = 'ask'; /************************** */
export const TH_ORDERBOOK = 'Orderbook'; /***************** */
export const TH_LOADING = 'loading';
export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
export const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
// export const PROVIDER_LOCAL = 'http://localhost:8555';
export const MNEMONIC =
	'concert load couple harbor equip island argue ramp clarify fence smart topic';
export const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
export const TOKEN_ZRX = 'ZRX';
export const TOKEN_WETH = 'WETH';
export const TAKER_ETH_DEPOSIT = 10; // for development only
export const NETWORK_ID_KOVAN = 42;
export const PROVIDER_INFURA_KOVAN = 'https://kovan.infura.io';
export const TOKEN_MAPPING: { [key: string]: string } = {
	'0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c': TOKEN_ZRX,
	'0x0b1ba0af832d7c05fd64161e0db78e85978e8082': TOKEN_WETH
};
export const TH_TRADE = 'Trades';
export const TH_SELL = 'sell';
export const TH_BUY = 'buy';
export const TH_OPERA = 'OPERATION';
export const TH_PX = 'Price';
export const TH_AMT = 'Amount';
export const TH_STATUS = 'Status';
export const TH_ACTIONS = 'Actions';
export const TH_ADD_BIDASK = 'addBidAsk';
