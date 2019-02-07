import { Constants, Web3Util } from '../../../../israfel-common/src';

const web3Util = new Web3Util(window, __ENV__ === Constants.DB_LIVE, '', false);
export default web3Util;
