import { combineReducers } from 'redux';
import { relayerReducer } from './relayerReducer';
import { uiReducer } from './uiReducer';
import { web3Reducer } from './web3Reducer';

const reducers = combineReducers({
	ui: uiReducer,
	web3: web3Reducer,
	relayer: relayerReducer
});

export default reducers;
