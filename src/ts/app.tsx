import 'css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import dynamoUtil from '../../../israfel-relayer/src/utils/dynamoUtil';
import * as dexActions from './actions/dexActions';
import * as dynamoActions from './actions/dynamoActions';
import * as web3Actions from './actions/web3Actions';
import * as wsActions from './actions/wsActions';
// import * as CST from './common/constants';
import web3Util from './common/web3Util';
import wsUtil from './common/wsUtil';
import Israfel from './components/Israfel';
import store from './store/store';
const config = require(`./keys/aws.ui.${__KOVAN__ ? 'dev' : 'live'}.json`);
dynamoUtil.init(config, !__KOVAN__);

web3Util.onWeb3AccountUpdate((addr: string, network: number) => {
	if (
		addr.toLowerCase() !== store.getState().web3.account.toLowerCase() ||
		network !== store.getState().web3.network
	) {
		store.dispatch(web3Actions.accountUpdate(addr));
		store.dispatch(web3Actions.networkUpdate(network));
		store.dispatch(dynamoActions.refresh());
	}
});

store.dispatch(web3Actions.refresh());

setInterval(() => {
	store.dispatch(web3Actions.refresh());
	store.dispatch(dynamoActions.refresh());
}, 60000);

wsUtil.onOrderUpdate((method, userOrder) => {
	// store.dispatch(wsActions.userOrderUpdate(userOrder));
	store.dispatch(dynamoActions.refresh());
	console.log(method, userOrder);
});
wsUtil.onOrderBookSnapshot((orderBookSnapshot) => {
	store.dispatch(dexActions.orderBookSnapshotUpdate(orderBookSnapshot));
});
wsUtil.onOrderBookUpdate((orderBookUpdate) => {
	store.dispatch(dexActions.orderBookUpdate(orderBookUpdate));
});

wsUtil.onConfigError(text => alert(text));
wsUtil.onReconnect(() => {
	alert('reconnecting');
	store.dispatch(wsActions.connectionUpdate(false));
});
wsUtil.onConnected(() => {
	store.dispatch(wsActions.connectionUpdate(true));
	store.dispatch(dynamoActions.refresh());
	ReactDOM.render(
		<Provider store={store}>
			<Router>
				<React.StrictMode>
					<Israfel />
				</React.StrictMode>
			</Router>
		</Provider>,
		document.getElementById('app')
	)
});
wsUtil.connectToRelayer();
