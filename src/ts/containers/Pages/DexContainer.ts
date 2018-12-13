import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as wsActions from 'ts/actions/wsActions';
import * as CST from 'ts/common/constants';
import { IState } from 'ts/common/types';
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
		orderBook: state.ws.orderBookSnapshot,
		connection: state.ws.connection,
		ethPrice: krakenPrices && krakenPrices.length ? krakenPrices[0].close : 0
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: (token: string) => dispatch(wsActions.subscribe(token + '|' + CST.TH_WETH)),
		unsubscribe: () => dispatch(wsActions.orderBookSubscriptionUpdate(''))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);
