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
						<Route path={'/'} render={() => <Dex />} />
					</Switch>
				</SContent>
			</Layout>
		);
	}
}
