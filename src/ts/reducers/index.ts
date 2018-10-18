import { combineReducers } from 'redux';
import { firebaseReducer } from './firebaseReducer';
// import { uiReducer } from './uiReducer';
import { wsReducer } from './wsReducer';

const reducers = combineReducers({
	firebase: firebaseReducer,
	// ui: uiReducer,
	ws: wsReducer
});

export default reducers;
