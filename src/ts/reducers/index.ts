import { combineReducers } from 'redux';
import { dexReducer } from './dexReducer';
import { dynamoReducer } from './dynamoReducer';
import { uiReducer } from './uiReducer';
import { web3Reducer } from './web3Reducer';
import { wsReducer } from './wsReducer';

const reducers = combineReducers({
	dex: dexReducer,
	dynamo: dynamoReducer,
	ui: uiReducer,
	web3: web3Reducer,
	ws: wsReducer
});

export default reducers;
