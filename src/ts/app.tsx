import 'css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import 'whatwg-fetch';
import Israfel from './containers/IsrafelContainer';
import store from './store/store';

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
