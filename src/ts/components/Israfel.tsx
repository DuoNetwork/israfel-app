import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dex from '../containers/DexContainer';
import { SContent } from './_styled';

export default class Israfel extends React.PureComponent {
	public render() {
		return (
			<Layout>
				<SContent>
					<Switch>
						<Route
							exact
							path={'/'}
							render={() => <div style={{ color: 'white' }}>Signed In</div>}
						/>
						<Route exact path={'/dex'} render={() => <Dex />} />
					</Switch>
				</SContent>
			</Layout>
		);
	}
}
