// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import 'css/styleV.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as relayerActions from './actions/relayerActions';
import * as web3Actions from './actions/web3Actions';
import { isVivaldiCustodian } from './common/duoWrapper';
import relayerClient from './common/relayerClient';
import util from './common/util';
import web3Util from './common/web3Util';
import Vivaldi from './containers/VivaldiContainer';
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
	store.dispatch(
		relayerActions.infoUpdate(
			tokens.filter(token => isVivaldiCustodian(token.custodian)),
			status,
			acceptedPrices,
			exchangePrices
		)
	);
	store.dispatch(web3Actions.refresh());
});

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
				title: `Orders ${method} ${orderHash}`,
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
				title: `Order Book ${method} ${pair}`,
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
				<Vivaldi types={[WrapperConstants.VIVALDI]} />
			</React.StrictMode>
		</Router>
	</Provider>,
	document.getElementById('app')
);
