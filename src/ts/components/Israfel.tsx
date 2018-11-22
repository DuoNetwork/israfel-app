import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dex from '../containers/Pages/DexContainer';
import Status from '../containers/Pages/StatusContainer';
import { SContent } from './_styled';

export default class Israfel extends React.Component {
	public render() {
		return (
			<Layout>
				<SContent>
					<Switch>
						<Route path={'/status'} render={() => <Status />} />
						<Route render={() => <Dex pair={'ZRX-WETH'} />} />
					</Switch>
				</SContent>
			</Layout>
		);
	}
}
