import Web3Util from '../../../../israfel-relayer/src/utils/Web3Util';

const web3Util = new Web3Util(window, !__KOVAN__, '');
export default web3Util;
