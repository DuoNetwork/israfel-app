import { combineReducers } from 'redux';
import { firebaseReducer } from './firebaseReducer';

const reducers = combineReducers({
	firebase: firebaseReducer
});

export default reducers;
