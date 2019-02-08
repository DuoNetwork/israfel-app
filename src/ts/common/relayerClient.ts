import { RelayerClient } from '@finbook/israfel-common';
import web3Util from './web3Util';

const relayerClient = new RelayerClient(web3Util, __ENV__);
export default relayerClient;
