import { combineReducers } from 'redux';
import { dexReducer } from './dexReducer';
import { uiReducer } from './uiReducer';
import { web3Reducer } from './web3Reducer';
import { wsReducer } from './wsReducer';

const reducers = combineReducers({
	dex: dexReducer,
	ui: uiReducer,
	web3: web3Reducer,
	ws: wsReducer
});

export default reducers;
