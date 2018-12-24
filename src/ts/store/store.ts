import { AnyAction, applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import { IState } from 'ts/common/types';
import reducers from 'ts/reducers';

const middleWares = [thunk as ThunkMiddleware<IState, AnyAction>];
if (process.env.NODE_ENV !== 'production') middleWares.push(createLogger());

const store = createStore(
	reducers,
	{},
	applyMiddleware<ThunkDispatch<IState, undefined, AnyAction>, IState>(...middleWares)
);

export default store;
