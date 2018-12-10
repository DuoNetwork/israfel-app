import { Layout } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IAcceptedPrice, ICustodianInfo, ITokenBalance } from 'ts/common/types';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
import ConvertCard from '../Cards/ConvertCard';
import CustodianCard from '../Cards/CustodianCard';
import TradeCard from '../Cards/TradeCard';
// import PriceChart from '../Charts/PriceChart';
interface IProps {
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	custodians: { [custodian: string]: ICustodianInfo };
	tokenBalances: { [code: string]: ITokenBalance };
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
		const { acceptedPrices, custodians, tokenBalances } = this.props;
		const { displayConvert, displayTrade } = this.state;
		const beethovenList: string[] = [];
		const mozartList: string[] = [];
		for (const custodian in custodians) {
			const info = custodians[custodian];
			const code = info.code.toLowerCase();
			if (code.startsWith(CST.BEETHOVEN.toLowerCase())) beethovenList.push(custodian);
			else if (code.startsWith(CST.MOZART.toLowerCase())) mozartList.push(custodian);
		}
		beethovenList.sort((a, b) => custodians[a].states.maturity - custodians[b].states.maturity);
		mozartList.sort((a, b) => custodians[a].states.maturity - custodians[b].states.maturity);
		return (
			<Layout>
				<div className="App">
					<Header />
					<SDivFlexCenter center horizontal marginBottom="10px;">
						{beethovenList.map(c => (
							<CustodianCard
								key={c}
								type={CST.BEETHOVEN}
								toggleConvertDisplay={this.toggleConvert}
								toggleTradeDisplay={this.toggleTrade}
								info={custodians[c]}
								margin="0 5px 0 0"
								acceptedPrices={acceptedPrices[c]}
								tokenBalances={tokenBalances}
							/>
						))}
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal>
						{mozartList.map(c => (
							<CustodianCard
								key={c}
								type={CST.MOZART}
								toggleConvertDisplay={this.toggleConvert}
								toggleTradeDisplay={this.toggleTrade}
								info={custodians[c]}
								margin="0 5px 0 0"
								acceptedPrices={acceptedPrices[c]}
								tokenBalances={tokenBalances}
							/>
						))}
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
