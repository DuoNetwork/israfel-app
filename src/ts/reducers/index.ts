import { combineReducers } from 'redux';
import { uiReducer } from './uiReducer';
import { web3Reducer } from './web3Reducer';
import { wsReducer } from './wsReducer';

const reducers = combineReducers({
	ui: uiReducer,
	web3: web3Reducer,
	ws: wsReducer
});

export default reducers;
