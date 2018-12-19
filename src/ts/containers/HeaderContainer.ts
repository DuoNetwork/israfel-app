import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as uiActions from 'ts/actions/uiActions';
import { IState } from 'ts/common/types';
import Header from 'ts/components/Header';

function mapStateToProps(state: IState) {
	const exchangePrices: { [source: string]: number } = {};
	for (const source in state.ws.exchangePrices)
		if (state.ws.exchangePrices[source].length)
			exchangePrices[source] = state.ws.exchangePrices[source][0].close;

	return {
		locale: state.ui.locale,
		network: state.web3.network,
		exchangePrices: exchangePrices
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
)(Header);
