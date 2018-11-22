import { Layout } from 'antd';
import * as React from 'react';
import Header from 'ts/containers/HeaderContainer';
import { SContent } from '../_styled';

export default class Loading extends React.Component {
	public render() {
		return (
			<Layout>
				<Header />
				<SContent>
					<div style={{ color: 'white' }}>Loading</div>
				</SContent>
			</Layout>
		);
	}
}
