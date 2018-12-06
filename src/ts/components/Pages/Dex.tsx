import { Layout } from 'antd';
import * as React from 'react';
// import * as CST from 'ts/common/constants';
// import web3Util from 'ts/common/web3Util';
import Header from 'ts/containers/HeaderContainer';
import {SDivFlexCenter} from '../_styled';
import Contract2in1Card from '../Cards/Contract2in1Card';

export default class Dex extends React.Component<any> {
	public render() {
		return (
			<Layout>
				<div className="App">
					<Header />
					<SDivFlexCenter center horizontal marginBottom="10px;">
						<Contract2in1Card title='Beethoven M19' margin='0 5px 0 0'/>
						<Contract2in1Card title='Beethoven PERPETUAL' margin='0 0 0 5px'/>
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal>
						<Contract2in1Card title='Mozart M19' margin='0 5px 0 0'/>
						<Contract2in1Card title='Mozart PERPETUAL' margin='0 0 0 5px'/>
					</SDivFlexCenter>
				</div>
			</Layout>
		);
	}
}
