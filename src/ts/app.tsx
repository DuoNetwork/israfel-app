import {notification} from 'antd';
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

const openNotification = (type: string, description: string) => {
	const args = {
		message: type.toUpperCase(),
		description: description,
		duration: 3
	};
	(notification as any)[type].open(args);
};

web3Util.onWeb3AccountUpdate((addr: string, network: number) => {
	if (
		addr.toLowerCase() !== store.getState().web3.account.toLowerCase() ||
		network !== store.getState().web3.network
	) {
		store.dispatch(web3Actions.accountUpdate(addr));
		store.dispatch(web3Actions.networkUpdate(network));
		store.dispatch(web3Actions.refresh());
	}
});

store.dispatch(web3Actions.refresh());
setInterval(() => store.dispatch(web3Actions.refresh()), 10000);

wsUtil.onInfoUpdate((tokens, status, acceptedPrices, exchangePrices) => {
	store.dispatch(wsActions.infoUpdate(tokens, status, acceptedPrices, exchangePrices));
	store.dispatch(web3Actions.refresh());
});
wsUtil.onOrder(
	userOrders => console.log(userOrders), //store.dispatch(dexActions.orderHistoryUpdate(userOrders)),
	userOrder => console.log(userOrder), // store.dispatch(dexActions.orderUpdate(userOrder)),
	(method, orderHash, error) => openNotification('error', method + orderHash + error)
);
wsUtil.onOrderBook(
	orderBookSnapshot => store.dispatch(dexActions.orderBookSnapshotUpdate(orderBookSnapshot)),
	orderBookUpdate => store.dispatch(dexActions.orderBookUpdate(orderBookUpdate)),
	(method, pair, error) => openNotification('error', method + pair + error)
);

wsUtil.onConnection(
	() => store.dispatch(wsActions.connectionUpdate(true)),
	() => store.dispatch(wsActions.connectionUpdate(false))
);

wsUtil.connectToRelayer();
if ((window as any).ethereum) (window as any).ethereum.enable();
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
