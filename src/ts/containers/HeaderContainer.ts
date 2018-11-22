import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as uiActions from 'ts/actions/uiActions';
import { IState } from 'ts/common/types';
import Header from 'ts/components/Header';

function mapStateToProps(state: IState) {
	return {
		locale: state.ui.locale,
		network: state.web3.network
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		updateLocale: (locale: string) => dispatch(uiActions.localeUpdate(locale))
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(Header) as any);
