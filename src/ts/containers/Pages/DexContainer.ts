import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as relayerActions from 'ts/actions/relayerActions';
import * as CST from 'ts/common/constants';
import { INotification, IState } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import Dex from 'ts/components/Pages/Dex';

function mapStateToProps(state: IState) {
	const krakenPrices = state.relayer.exchangePrices['kraken'];
	return {
		account: state.web3.account,
		acceptedPrices: state.relayer.acceptedPrices,
		custodians: state.web3.custodians,
		custodianTokenBalances: state.web3.custodianTokenBalances,
		ethBalance: state.web3.ethBalance,
		orderBooks: state.relayer.orderBookSnapshot,
		orderHistory: state.relayer.orderHistory,
		connection: state.relayer.connection,
		etherToken: web3Util.contractAddresses.etherToken,
		ethPrice: krakenPrices && krakenPrices.length ? krakenPrices[0].close : 0
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		notify: (notification: INotification) =>
			dispatch(relayerActions.notificationUpdate(notification)),
		subscribeOrder: (account: string) => dispatch(relayerActions.subscribeOrder(account)),
		unsubscribeOrder: () => dispatch(relayerActions.orderSubscriptionUpdate('')),
		wrapEther: (amount: number, address: string) => web3Util.wrapEther(amount, address),
		unwrapEther: (amount: number, address: string) => web3Util.unwrapEther(amount, address),
		getTokenByCode: (code: string) => web3Util.getTokenByCode(code),
		setUnlimitedTokenAllowance: (code: string, account: string, spender?: string) =>
			web3Util.setUnlimitedTokenAllowance(code, account, spender),
		web3PersonalSign: (account: string, message: string) =>
			web3Util.web3PersonalSign(account, CST.TERMINATE_SIGN_MSG + message)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);
