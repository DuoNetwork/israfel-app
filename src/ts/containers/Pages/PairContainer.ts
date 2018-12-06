import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as dexActions from '../../actions/dexActions';
import { IState } from '../../common/types';
import Pair from '../../components/Pages/Pair';

function mapStateToProps(state: IState) {
	return {
		locale: state.ui.locale,
		account: state.web3.account,
		orderHistory: state.dex.orderHistory,
		orderBook: state.dex.orderBookSnapshot,
		ethBalance: state.web3.ethBalance,
		tokenBalance: state.dex.tokenBalance,
		connection: state.ws.connection
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: (account: string, pair: string) => dispatch(dexActions.subscribe(account, pair)),
		unsubscribe: (account: string) => {
			dispatch(dexActions.orderBookSubscriptionUpdate(account, ''));
			dispatch(dexActions.userSubscriptionUpdate(0));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pair);
