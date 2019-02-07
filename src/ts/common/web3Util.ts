import Web3Util from '../../../../israfel-relayer/src/utils/Web3Util';
import { DB_LIVE } from './constants';

const web3Util = new Web3Util(window, __ENV__ === DB_LIVE, '', false);
export default web3Util;
