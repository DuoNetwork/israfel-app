import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SContent } from './_styled';

export default class Israfel extends React.PureComponent {
	public render() {
		return (
			<Layout>
				<SContent>
					<Switch>
						<Route render={() => <div style={{color: 'white'}}>Signed In</div>} />
					</Switch>
				</SContent>
			</Layout>
		);
	}
}
