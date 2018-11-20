import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as uiActions from '../actions/uiActions';
import { IState } from '../common/types';
import Dex from '../components/Dex';

function mapStateToProps(state: IState) {
	return {
		network: state.web3.network,
		locale: state.ui.locale,
		account: state.web3.account,
		userOrders: state.dex.userOrders
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		updateLocale: (locale: string) => dispatch(uiActions.localeUpdate(locale))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dex);
