import { Layout } from 'antd';
import * as React from 'react';
// import * as CST from 'ts/common/constants';
// import web3Util from 'ts/common/web3Util';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
import Contract2in1Card from '../Cards/Contract2in1Card';
import CovertPopup from '../Cards/ConvertPopup';
import TradePopup from '../Cards/TradePopup';

interface IState {
	displayConvert: boolean;
	displayTrade: boolean;
}
export default class Dex extends React.Component<{}, IState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			displayConvert: false,
			displayTrade: false
		};
	}
	public toggleConvert = () => {
		this.setState({ displayConvert: !this.state.displayConvert });
	};
	public toggleTrade = () => {
		this.setState({ displayTrade: !this.state.displayTrade });
	};

	public render() {
		const { displayConvert, displayTrade } = this.state;
		return (
			<Layout>
				<div className="App">
					<Header />
					<SDivFlexCenter center horizontal marginBottom="10px;">
						<Contract2in1Card
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Beethoven M19"
							margin="0 5px 0 0"
						/>
						<Contract2in1Card
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Beethoven PERPETUAL"
							margin="0 0 0 5px"
						/>
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal>
						<Contract2in1Card
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Mozart M19"
							margin="0 5px 0 0"
						/>
						<Contract2in1Card
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Mozart PERPETUAL"
							margin="0 0 0 5px"
						/>
					</SDivFlexCenter>
					<CovertPopup
						title="Beethoven M19"
						toggleDisplay={this.toggleConvert}
						display={displayConvert}
					/>
					<TradePopup
						title="Beethoven M19"
						toggleDisplay={this.toggleTrade}
						display={displayTrade}
					/>
				</div>
			</Layout>
		);
	}
}
