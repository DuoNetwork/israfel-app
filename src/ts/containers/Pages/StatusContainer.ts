import { connect } from 'react-redux';
import { IState } from 'ts/common/types';
import Status from 'ts/components/Pages/Status';

function mapStateToProps(state: IState) {
	return {
		status: state.relayer.status
	};
}

export default connect(
	mapStateToProps,
	{}
)(Status);
