import { Layout, Spin } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import {
	IAcceptedPrice,
	ICustodianInfo,
	IEthBalance,
	IOrderBookSnapshot,
	IToken,
	ITokenBalance
} from 'ts/common/types';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
import ConvertCard from '../Cards/ConvertCard';
import CustodianCard from '../Cards/CustodianCard';
import TradeCard from '../Cards/TradeCard';
interface IProps {
	ethBalance: IEthBalance;
	tokens: IToken[];
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	custodians: { [custodian: string]: ICustodianInfo };
	custodianTokenBalances: { [custodian: string]: { [code: string]: ITokenBalance } };
	orderBook: IOrderBookSnapshot;
	connection: boolean;
	subscribe: (pair: string) => any;
	unsubscribe: () => any;
}

interface IState {
	convertCustodian: string;
	tradeToken: string;
}

export default class Dex extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			convertCustodian: '',
			tradeToken: ''
		};
	}

	public componentDidMount() {
		document.title = 'DUO | Trustless Derivatives';
	}

	public handleConvert = (custodian: string) => this.setState({ convertCustodian: custodian.toLocaleLowerCase() });

	public handleTrade = (token: string) => {
		if (!token)
			this.props.unsubscribe();
		else
			this.props.subscribe(token);
		this.setState({ tradeToken: token })
	};

	public render() {
		const {
			tokens,
			acceptedPrices,
			custodians,
			custodianTokenBalances,
			ethBalance,
			connection,
			orderBook
		} = this.props;
		const { convertCustodian, tradeToken } = this.state;
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
		const tradeTokenInfo = tokens.find(t => t.code === tradeToken);
		const tradeTokenBalance = tradeTokenInfo
			? custodianTokenBalances[tradeTokenInfo.custodian][tradeToken]
			: undefined;
		return (
			<Layout>
				<div className="App">
					<Header />
					<Spin spinning={!connection} tip="loading...">
						<SDivFlexCenter center horizontal marginBottom="20px;">
							{beethovenList.map(c => (
								<CustodianCard
									key={c}
									type={CST.BEETHOVEN}
									handleConvert={this.handleConvert}
									handleTrade={this.handleTrade}
									info={custodians[c]}
									margin="0 20px 0 0"
									acceptedPrices={acceptedPrices[c]}
									tokenBalances={custodianTokenBalances[c] || {}}
								/>
							))}
						</SDivFlexCenter>
						<SDivFlexCenter center horizontal>
							{mozartList.map(c => (
								<CustodianCard
									key={c}
									type={CST.MOZART}
									handleConvert={this.handleConvert}
									handleTrade={this.handleTrade}
									info={custodians[c]}
									margin="0 20px 0 0"
									acceptedPrices={acceptedPrices[c]}
									tokenBalances={custodianTokenBalances[c] || {}}
								/>
							))}
						</SDivFlexCenter>
						<ConvertCard
							custodian={convertCustodian}
							info={custodians[convertCustodian]}
							handleClose={() => this.handleConvert('')}
						/>
						<TradeCard
							token={tradeToken}
							tokenInfo={tradeTokenInfo}
							tokenBalance={tradeTokenBalance}
							ethBalance={ethBalance}
							orderBook={orderBook}
							handleClose={() => this.handleTrade('')}
						/>
					</Spin>
				</div>
			</Layout>
		);
	}
}
