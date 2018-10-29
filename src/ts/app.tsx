import 'css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import 'whatwg-fetch';
import * as wsActions from './actions/wsActions';
import * as CST from './common/constants';
import wsUtil from './common/wsUtil';
import Israfel from './containers/IsrafelContainer';
import store from './store/store';

wsUtil.init(CST.RELAYER_WS_URL);
wsUtil.onOrderBooks(orderBooks => store.dispatch(wsActions.orderBooksUpdate(orderBooks)));

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<React.StrictMode>
				<Israfel />
			</React.StrictMode>
		</Router>
	</Provider>,
	document.getElementById('app')
);
