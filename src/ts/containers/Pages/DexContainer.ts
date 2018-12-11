import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as dexActions from 'ts/actions/dexActions';
import * as CST from 'ts/common/constants';
import { IState } from 'ts/common/types';
import Dex from 'ts/components/Pages/Dex';

function mapStateToProps(state: IState) {
	return {
		account: state.web3.account,
		tokens: state.ws.tokens,
		acceptedPrices: state.ws.acceptedPrices,
		custodians: state.web3.custodians,
		custodianTokenBalances: state.web3.custodianTokenBalances,
		ethBalance: state.web3.ethBalance,
		orderBook: state.dex.orderBookSnapshot,
		connection: state.ws.connection
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: (token: string) => dispatch(dexActions.subscribe('', token + '|' + CST.TH_WETH)),
		unsubscribe: () => dispatch(dexActions.orderBookSubscriptionUpdate('', ''))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);
