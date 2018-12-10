// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import Web3Util from '../../../../israfel-relayer/src/utils/Web3Util';

const web3Util = new Web3Util(window, !__KOVAN__, '', false);
export default web3Util;
