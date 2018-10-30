import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as wsActions from '../actions/wsActions';
import { IState } from '../common/types';
import Dex from '../components/Dex';

function mapStateToProps(state: IState) {
	return {
		wsUserOrderResponse: state.ws.subscribe,
		bidAskMsg: state.ws.addBidAsk,
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscription: (marketId: string, pair: string) => {
			dispatch(wsActions.onSubscription(marketId, pair));
		},
		submitOrders: (amount: number, price: number, action: string) => {
			dispatch(wsActions.onAddOrders(amount, price, action));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex as any);
