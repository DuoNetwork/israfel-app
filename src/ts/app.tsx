import 'css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as dexActions from './actions/dexActions';
import * as web3Actions from './actions/web3Actions';
import * as wsActions from './actions/wsActions';
import web3Util from './common/web3Util';
import wsUtil from './common/wsUtil';
import Israfel from './containers/IsrafelContainer';
import store from './store/store';

web3Util.onWeb3AccountUpdate((addr: string, network: number) => {
	if (
		addr.toLowerCase() !== store.getState().web3.account.toLowerCase() ||
		network !== store.getState().web3.network
	) {
		store.dispatch(web3Actions.accountUpdate(addr));
		store.dispatch(web3Actions.networkUpdate(network));
	}
});

store.dispatch(web3Actions.refresh());
setInterval(() => store.dispatch(web3Actions.refresh()), 60000);

wsUtil.onOrderUpdate(userOrder => store.dispatch(dexActions.orderUpdate(userOrder)));
wsUtil.onOrderHistoryUpdate(userOrders =>
	store.dispatch(dexActions.orderHistoryUpdate(userOrders))
);
wsUtil.onOrderBookSnapshot(orderBookSnapshot =>
	store.dispatch(dexActions.orderBookSnapshotUpdate(orderBookSnapshot))
);
wsUtil.onOrderBookUpdate(orderBookUpdate =>
	store.dispatch(dexActions.orderBookUpdate(orderBookUpdate))
);

wsUtil.onConfigError(text => alert(text));
wsUtil.onReconnect(() => store.dispatch(wsActions.connectionUpdate(false)));
wsUtil.onTokensUpdate(tokens => store.dispatch(wsActions.tokensUpdate(tokens)));
wsUtil.onStatusUpdate(status => store.dispatch(wsActions.statusUpdate(status)));

wsUtil.onConnected(() => {
	store.dispatch(wsActions.connectionUpdate(true));
	ReactDOM.render(
		<Provider store={store}>
			<Router>
				<React.StrictMode>
					<Israfel />
				</React.StrictMode>
			</Router>
		</Provider>,
		document.getElementById('app')
	);
});
wsUtil.connectToRelayer();
