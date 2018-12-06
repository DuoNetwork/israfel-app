import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IToken } from 'ts/common/types';
import Dex from 'ts/containers/pages/DexContainer';
import Pair from 'ts/containers/Pages/PairContainer';
import Status from 'ts/containers/Pages/StatusContainer';
import Loading from './Pages/Loading';

interface IProps {
	tokens: IToken[];
}

export default class Israfel extends React.Component<IProps> {
	public render() {
		return (
			<Switch>
					<Route path={'/status'} render={() => <Status />} />
					{this.props.tokens.map(token => (
						<Route
							key={token.code}
							path={`/${token.code}-WETH`}
							render={() => <Pair pair={`${token.code}|WETH`} />}
						/>
					))}
					{this.props.tokens.length ? (
						<Route render={() => <Dex />} />
					) : (
						<Route render={() => <Loading />} />
					)}
				</Switch>
		);
	}
}
