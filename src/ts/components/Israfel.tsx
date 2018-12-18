import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IToken } from 'ts/common/types';
import Message from 'ts/containers/Common/MessageContainer';
import Header from 'ts/containers/HeaderContainer';
import Dex from 'ts/containers/Pages/DexContainer';
// import Pair from 'ts/containers/Pages/PairContainer';
import Status from 'ts/containers/Pages/StatusContainer';
import { SContent } from './_styled';

interface IProps {
	tokens: IToken[];
}

export default class Israfel extends React.Component<IProps> {
	public render() {
		return (
			<Layout>
				<Message />
				<Header />
				<SContent>
					<Switch>
						<Route path={'/status'} render={() => <Status />} />
						{/* {this.props.tokens.map(token => (
							<Route
								key={token.code}
								path={`/${token.code}-WETH`}
								render={() => <Pair pair={`${token.code}|WETH`} />}
							/>
						))}
						{this.props.tokens.length ? (
							<Route path={'/pairs'} render={() => <Pair pair={'B-PPT-I0|WETH'} />} />
						) : (
							<Route render={() => <Loading />} />
						)} */}
						<Route render={() => <Dex/>} />
					</Switch>
				</SContent>
			</Layout>
		);
	}
}
