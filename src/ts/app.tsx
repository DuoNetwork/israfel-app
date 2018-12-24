import 'css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as web3Actions from './actions/web3Actions';
import * as wsActions from './actions/wsActions';
import util from './common/util';
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
	userOrders => store.dispatch(wsActions.orderHistoryUpdate(userOrders)),
	userOrder => {
		store.dispatch(wsActions.orderUpdate(userOrder));
		store.dispatch(
			wsActions.notificationUpdate({
				level: 'info',
				title: util.getOrderTitle(userOrder),
				message: util.getOrderFullDescription(userOrder),
				transactionHash: ''
			})
		);
	},
	(method, orderHash, error) =>
		store.dispatch(
			wsActions.notificationUpdate({
				level: 'error',
				title: method + orderHash,
				message: error,
				transactionHash: ''
			})
		)
);
wsUtil.onOrderBook(
	orderBookSnapshot => store.dispatch(wsActions.orderBookSnapshotUpdate(orderBookSnapshot)),
	orderBookUpdate => store.dispatch(wsActions.orderBookUpdate(orderBookUpdate)),
	(method, pair, error) =>
		store.dispatch(
			wsActions.notificationUpdate({
				level: 'error',
				title: method + pair,
				message: error,
				transactionHash: ''
			})
		)
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
