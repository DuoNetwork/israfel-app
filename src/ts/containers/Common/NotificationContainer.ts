import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as relayerActions from 'ts/actions/relayerActions';
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

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		clear: () =>
			dispatch(
				relayerActions.notificationUpdate({
					level: '',
					title: '',
					message: '',
					transactionHash: ''
				})
			)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Notification);
