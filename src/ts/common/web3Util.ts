import { Constants, Web3Util } from '../../../../israfel-common/src';

const live = __ENV__ === Constants.DB_LIVE;
const web3Util = new Web3Util(
	window,
	live ? Constants.PROVIDER_INFURA_MAIN : Constants.PROVIDER_INFURA_KOVAN,
	'',
	live
);
export default web3Util;
