import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Notification from 'ts/containers/Common/NotificationContainer';
import Header from 'ts/containers/HeaderContainer';
import Dex from 'ts/containers/Pages/DexContainer';
// import Pair from 'ts/containers/Pages/PairContainer';
import Status from 'ts/containers/Pages/StatusContainer';
import { SContent } from './_styled';

export default class Israfel extends React.Component<{}> {
	public render() {
		return (
			<Layout>
				<Notification />
				<Header />
				<SContent>
					<Switch>
						<Route path={'/status'} render={() => <Status />} />
						<Route
							render={() => (
								<Dex
									types={[WrapperConstants.BEETHOVEN, WrapperConstants.MOZART]}
								/>
							)}
						/>
					</Switch>
				</SContent>
			</Layout>
		);
	}
}
