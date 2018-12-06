import { Layout } from 'antd';
import * as React from 'react';
// import * as CST from 'ts/common/constants';
// import web3Util from 'ts/common/web3Util';
import Header from 'ts/containers/HeaderContainer';
import M19Card from '../Cards/M19Card';

export default class Dex extends React.Component<any> {
	public render() {
		return (
			<Layout>
				<div className="App">
					<Header />
					<div style={{ display: 'flex' }}>
						<M19Card />
						<M19Card />
					</div>
					<div style={{ display: 'flex' }}>
						<M19Card />
						<M19Card />
					</div>
				</div>
			</Layout>
		);
	}
}
