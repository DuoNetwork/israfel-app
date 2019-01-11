import 'css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as relayerActions from './actions/relayerActions';
import * as web3Actions from './actions/web3Actions';
import relayerClient from './common/relayerClient';
import util from './common/util';
import web3Util from './common/web3Util';
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

relayerClient.onInfoUpdate((tokens, status, acceptedPrices, exchangePrices) => {
	store.dispatch(relayerActions.infoUpdate(tokens, status, acceptedPrices, exchangePrices));
	store.dispatch(web3Actions.refresh());
});
relayerClient.onTrade(
	trade => store.dispatch(relayerActions.tradeUpdate(trade)),
	(method, pair, error) =>
		store.dispatch(
			relayerActions.notificationUpdate({
				level: 'error',
				title: method + pair,
				message: error,
				transactionHash: ''
			})
		)
);
relayerClient.onOrder(
	userOrders => store.dispatch(relayerActions.orderHistoryUpdate(userOrders)),
	userOrder => {
		store.dispatch(relayerActions.orderUpdate(userOrder));
		store.dispatch(
			relayerActions.notificationUpdate({
				level: 'info',
				title: util.getOrderTitle(userOrder),
				message: util.getOrderDescription(userOrder),
				transactionHash: ''
			})
		);
	},
	(method, orderHash, error) =>
		store.dispatch(
			relayerActions.notificationUpdate({
				level: 'error',
				title: method + orderHash,
				message: error,
				transactionHash: ''
			})
		)
);
relayerClient.onOrderBook(
	orderBookSnapshot => store.dispatch(relayerActions.orderBookUpdate(orderBookSnapshot)),
	(method, pair, error) =>
		store.dispatch(
			relayerActions.notificationUpdate({
				level: 'error',
				title: method + pair,
				message: error,
				transactionHash: ''
			})
		)
);

relayerClient.onConnection(
	() => store.dispatch(relayerActions.connectionUpdate(true)),
	() => store.dispatch(relayerActions.connectionUpdate(false))
);

relayerClient.connectToRelayer();
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
