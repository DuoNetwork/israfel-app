import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { IState } from 'ts/common/types';
import Israfel from 'ts/components/Israfel';

function mapStateToProps(state: IState) {
	return {
		tokens: state.relayer.tokens
	};
}

export default withRouter(connect(
	mapStateToProps,
	{}
)(Israfel) as any);
