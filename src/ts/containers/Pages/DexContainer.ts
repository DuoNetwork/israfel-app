import { connect } from 'react-redux';
import { IState } from '../../common/types';
import Dex from '../../components/Pages/Dex';

function mapStateToProps(state: IState) {
	return {
		acceptedPrices: state.ws.acceptedPrices,
		custodians: state.web3.custodians,
		tokenBalances: state.web3.tokenBalances
	};
}

export default connect(
	mapStateToProps,
	{}
)(Dex);
