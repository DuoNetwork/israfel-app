import { combineReducers } from 'redux';
// import { uiReducer } from './uiReducer';
import { wsReducer } from './wsReducer';

const reducers = combineReducers({
	// ui: uiReducer,
	ws: wsReducer
});

export default reducers;
