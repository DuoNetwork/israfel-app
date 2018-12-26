import { connect } from 'react-redux';
import { IState } from 'ts/common/types';
import Notification from 'ts/components/Common/Notification';

function mapStateToProps(state: IState) {
	return {
		level: state.relayer.notification.level,
		title: state.relayer.notification.title,
		message: state.relayer.notification.message,
		transactionHash: state.relayer.notification.transactionHash
	};
}

export default connect(
	mapStateToProps,
	{}
)(Notification);
