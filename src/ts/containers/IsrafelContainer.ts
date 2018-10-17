import { connect } from 'react-redux';
import { IState } from 'ts/common/types';
import Israfel from 'ts/components/Israfel';

function mapStateToProps(state: IState) {
	return {
		signedIn: state.firebase.auth
	};
}

export default connect(mapStateToProps, {})(Israfel);
