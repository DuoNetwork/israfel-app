import { connect } from 'react-redux';
import { IState } from '../../common/types';
import Dex from '../../components/Pages/Dex';

function mapStateToProps(state: IState) {
	return {
		tokens: state.ws.tokens,
		acceptedPrices: state.ws.acceptedPrices
	};
}

export default connect(
	mapStateToProps,
	{}
)(Dex);
