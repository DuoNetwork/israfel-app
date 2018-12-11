import { connect } from 'react-redux';
import { IState } from '../../common/types';
import Dex from '../../components/Pages/Dex';

function mapStateToProps(state: IState) {
	return {
		tokens: state.ws.tokens,
		acceptedPrices: state.ws.acceptedPrices,
		custodians: state.web3.custodians,
		custodianTokenBalances: state.web3.custodianTokenBalances,
		ethBalance: state.web3.ethBalance
	};
}

export default connect(
	mapStateToProps,
	{}
)(Dex);
