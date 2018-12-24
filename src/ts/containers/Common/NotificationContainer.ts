import { connect } from 'react-redux';
import { IState } from 'ts/common/types';
import Notification from 'ts/components/Common/Notification';

function mapStateToProps(state: IState) {
	return {
		level: state.ws.notification.level,
		title: state.ws.notification.title,
		message: state.ws.notification.message,
		transactionHash: state.ws.notification.transactionHash
	};
}

export default connect(
	mapStateToProps,
	{}
)(Notification);
