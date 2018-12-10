import { Layout } from 'antd';
import * as React from 'react';
import Header from 'ts/containers/HeaderContainer';
import { IAcceptedPrice } from '../../../../../duo-admin/src/common/types';
import * as relayerTypes from '../../../../../israfel-relayer/src/common/types';
import { SDivFlexCenter } from '../_styled';
import ConvertCard from '../Cards/ConvertCard';
import CustodianCard from '../Cards/CustodianCard';
import TradeCard from '../Cards/TradeCard';
// import PriceChart from '../Charts/PriceChart';
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
		const { tokens } = this.props;
		const { acceptedPrices } = this.props;
		console.log('acceptedPrices');
		console.log(acceptedPrices);
		console.log(tokens);

		const { displayConvert, displayTrade } = this.state;
		// const data = [
		// 	{
		// 		contractAddress: '0x95B3BE483e9e3685Ed631e9611b8cDba4C13641E',
		// 		transactionHash:
		// 			'0x1c5c9e505e7b6a9f03502887b559077b3b56c546158b60b0a1f94e087f2bf4ae',
		// 		blockNumber: 9637842,
		// 		price: 89.74803019475921,
		// 		navA: 1.0003,
		// 		timestamp: 1544313600000
		// 	},
		// 	{
		// 		contractAddress: '0x95B3BE483e9e3685Ed631e9611b8cDba4C13641E',
		// 		transactionHash:
		// 			'0x6e366d79c7daffa3d8d494f5120952e778592f2d8d2ba6275c6fc5f89c0e0ec1',
		// 		blockNumber: 9638341,
		// 		price: 89.06262943063913,
		// 		navA: 1.000306,
		// 		timestamp: 1544317200000
		// 	},
		// 	{
		// 		contractAddress: '0x95B3BE483e9e3685Ed631e9611b8cDba4C13641E',
		// 		transactionHash: '0x24f865084abd8179a77a55d31ef266b62a7a0502a2552d979d37689af9c62b',
		// 		blockNumber: 9638841,
		// 		price: 89.9966485945299,
		// 		navA: 1.000312,
		// 		timestamp: 1544320800000
		// 	}
		// ];
		// for (let i = 0; i < 10000; i += 100) data.push({ x: i, y: Math.random() * 10000 });
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
				{/* <PriceChart timeStep={60000} prices={data} /> */}
			</Layout>
		);
	}
}
