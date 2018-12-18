// import { connect } from 'react-redux';
// import { AnyAction } from 'redux';
// import { ThunkDispatch } from 'redux-thunk';
// import * as wsActions from 'ts/actions/wsActions';
// import { IState } from 'ts/common/types';
// import Pair from 'ts/components/Pages/Pair';

// function mapStateToProps(state: IState /*, ownProps: any*/) {
// 	// const code = ownProps.pair.split('|')[0];
// 	return {
// 		locale: state.ui.locale,
// 		account: state.web3.account,
// 		orderHistory: [], //state.dex.orderHistory,
// 		orderBook: state.ws.orderBookSnapshot,
// 		ethBalance: state.web3.ethBalance,
// 		tokenBalance: /*state.web3.tokenBalances[code] ||*/ {
// 			balance: 0,
// 			allowance: 0
// 		},
// 		connection: state.ws.connection
// 	};
// }

// function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
// 	return {
// 		subscribe: (pair: string) => dispatch(wsActions.subscribeOrderBook(pair)),
// 		unsubscribe: () => dispatch(wsActions.orderBookSubscriptionUpdate(''))
// 	};
// }

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(Pair);
