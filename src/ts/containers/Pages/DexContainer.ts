import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as dexActions from '../../actions/dexActions';
import { IState } from '../../common/types';
import Dex from '../../components/Pages/Dex';

function mapStateToProps(state: IState) {
	return {
		locale: state.ui.locale,
		account: state.web3.account,
		userOrders: state.dex.userOrders,
		orderBook: state.dex.orderBookSnapshot,
		ethBalance: state.web3.ethBalance,
		tokenBalance: state.dex.tokenBalance,
		connection: state.ws.connection
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: (pair: string) => dispatch(dexActions.subscribe(pair)),
		unsubscribe: () => {
			dispatch(dexActions.orderBookSubscriptionUpdate(''));
			dispatch(dexActions.userSubscriptionUpdate(0));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);