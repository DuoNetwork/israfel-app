import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as relayerActions from 'ts/actions/relayerActions';
import relayerClient from 'ts/common/relayerClient';
import { INotification, IState } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import Vivaldi from 'ts/components/Vivaldi';

function mapStateToProps(state: IState) {
	const krakenPrices = state.relayer.exchangePrices['kraken'];
	return {
		locale: state.ui.locale,
		network: state.web3.network,
		tokens: state.relayer.tokens,
		account: state.web3.account,
		custodians: state.web3.custodians,
		custodianTokenBalances: state.web3.custodianTokenBalances,
		ethBalance: state.web3.ethBalance,
		orderBooks: state.relayer.orderBookSnapshots,
		orderHistory: state.relayer.orderHistory,
		connection: state.relayer.connection,
		wethAddress: web3Util.contractAddresses.etherToken,
		ethPrice: krakenPrices && krakenPrices.length ? krakenPrices[0].close : 0,
		exchangePrices: state.relayer.exchangePrices['kraken'],
		titleN: state.relayer.notification.title,
		wrapEther: (amount: number, address: string) => web3Util.wrapEther(amount, address),
		setUnlimitedTokenAllowance: (code: string, account: string, spender?: string) =>
			web3Util.setUnlimitedTokenAllowance(code, account, spender),
		addOrder: (
			account: string,
			pair: string,
			price: number,
			amount: number,
			isBid: boolean,
			expiry: number
		) => relayerClient.addOrder(account, pair, price, amount, isBid, expiry)
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		notify: (notification: INotification) =>
			dispatch(relayerActions.notificationUpdate(notification)),
		subscribeOrder: (account: string) => dispatch(relayerActions.subscribeOrder(account)),
		unsubscribeOrder: () => dispatch(relayerActions.orderSubscriptionUpdate(''))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Vivaldi);
