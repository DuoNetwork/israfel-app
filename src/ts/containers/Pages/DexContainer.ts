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
		updateOrders: state.dex.updateOrders,
		userOrders: state.dex.userOrders,
		orderBook: state.dex.orderBookSnapshot
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: (pair: string) => dispatch(dexActions.subscribeOrderBook(pair)),
		unsubscribe: () => dispatch(dexActions.orderBookSubscriptionUpdate(''))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);
