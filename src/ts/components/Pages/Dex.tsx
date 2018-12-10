import { Layout } from 'antd';
import * as React from 'react';
import Header from 'ts/containers/HeaderContainer';
import { IAcceptedPrice } from '../../../../../duo-admin/src/common/types';
import * as relayerTypes from '../../../../../israfel-relayer/src/common/types';
import { SDivFlexCenter } from '../_styled';
import ConvertCard from '../Cards/ConvertCard';
import CustodianCard from '../Cards/CustodianCard';
import TradeCard from '../Cards/TradeCard';
interface IProps {
	tokens: relayerTypes.IToken[];
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
}

interface IState {
	displayConvert: boolean;
	displayTrade: boolean;
}

export default class Dex extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			displayConvert: false,
			displayTrade: false
		};
	}

	public componentDidMount() {
		document.title = 'DUO | Trustless Derivatives';
	}

	public toggleConvert = () => {
		this.setState({ displayConvert: !this.state.displayConvert });
	};
	public toggleTrade = () => {
		this.setState({ displayTrade: !this.state.displayTrade });
	};

	public render() {
		// const { tokens } = this.props;
		const { acceptedPrices } = this.props;
		const { displayConvert, displayTrade } = this.state;
		console.log(acceptedPrices);
		return (
			<Layout>
				<div className="App">
					<Header />
					<SDivFlexCenter center horizontal marginBottom="10px;">
						<CustodianCard
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Beethoven M19"
							margin="0 5px 0 0"
							acceptedPrices={acceptedPrices[Object.keys(acceptedPrices)[0] as any]}
						/>
						<CustodianCard
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Beethoven PERPETUAL"
							margin="0 0 0 5px"
							acceptedPrices={acceptedPrices[Object.keys(acceptedPrices)[1] as any]}
						/>
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal>
						<CustodianCard
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Beethoven M19"
							margin="0 5px 0 0"
							acceptedPrices={acceptedPrices[Object.keys(acceptedPrices)[2] as any]}
						/>
						<CustodianCard
							toggleConvertDisplay={this.toggleConvert}
							toggleTradeDisplay={this.toggleTrade}
							title="Mozart PERPETUAL"
							margin="0 0 0 5px"
							acceptedPrices={acceptedPrices[Object.keys(acceptedPrices)[3] as any]}
						/>
					</SDivFlexCenter>
					<ConvertCard
						title="Beethoven M19"
						toggleDisplay={this.toggleConvert}
						display={displayConvert}
					/>
					<TradeCard
						title="Beethoven M19"
						toggleDisplay={this.toggleTrade}
						display={displayTrade}
					/>
				</div>
			</Layout>
		);
	}
}
