import { connect } from 'react-redux';
import { IState } from 'ts/common/types';
import Message from 'ts/components/Common/Message';

function mapStateToProps(state: IState) {
	return {
		level: state.ws.level,
		message: state.ws.message
	};
}

export default connect(
	mapStateToProps,
	{}
)(Message);
