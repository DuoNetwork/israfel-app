import { connect } from 'react-redux';
import { IState } from 'ts/common/types';
import Israfel from 'ts/components/Israfel';

function mapStateToProps(state: IState) {
	return {
		tokens: state.ws.tokens
	};
}

export default connect(
	mapStateToProps,
	{}
)(Israfel);
