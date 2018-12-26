import RelayerClient from '../../../../israfel-relayer/src/client/RelayerClient';
import web3Util from './web3Util';

const relayerClient = new RelayerClient(web3Util, __ENV__);
export default relayerClient;
