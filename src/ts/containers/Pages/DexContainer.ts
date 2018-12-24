import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as wsActions from 'ts/actions/wsActions';
import { INotification, IState } from 'ts/common/types';
import Dex from 'ts/components/Pages/Dex';

function mapStateToProps(state: IState) {
	const krakenPrices = state.ws.exchangePrices['kraken'];
	return {
		account: state.web3.account,
		tokens: state.ws.tokens,
		acceptedPrices: state.ws.acceptedPrices,
		custodians: state.web3.custodians,
		custodianTokenBalances: state.web3.custodianTokenBalances,
		ethBalance: state.web3.ethBalance,
		orderBooks: state.ws.orderBookSnapshot,
		orderHistory: state.ws.orderHistory,
		connection: state.ws.connection,
		ethPrice: krakenPrices && krakenPrices.length ? krakenPrices[0].close : 0
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		notify: (notification: INotification) =>
			dispatch(wsActions.notificationUpdate(notification)),
		subscribeOrder: (account: string) => dispatch(wsActions.subscribeOrder(account)),
		unsubscribeOrder: () => dispatch(wsActions.orderSubscriptionUpdate(''))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);
