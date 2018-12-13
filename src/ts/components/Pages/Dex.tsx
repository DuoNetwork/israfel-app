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
	account: string;
	ethBalance: IEthBalance;
	tokens: IToken[];
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	ethPrice: number;
	custodians: { [custodian: string]: ICustodianInfo };
	custodianTokenBalances: { [custodian: string]: { [code: string]: ITokenBalance } };
	orderBook: IOrderBookSnapshot;
	connection: boolean;
	subscribeOrderBook: (pair: string) => any;
	unsubscribeOrderBook: () => any;
}

interface IState {
	convertCustodian: string;
	convertAToken: string;
	convertBToken: string;
	tradeToken: string;
}

export default class Dex extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			convertCustodian: '',
			convertAToken: '',
			convertBToken: '',
			tradeToken: ''
		};
	}

	public componentDidMount() {
		document.title = 'DUO | Trustless Derivatives';
	}

	public handleConvert = (custodian: string, aToken: string, bToken: string) =>
		this.setState({
			convertCustodian: custodian.toLocaleLowerCase(),
			convertAToken: aToken,
			convertBToken: bToken
		});

	public handleTrade = (token: string) => {
		if (!token) this.props.unsubscribeOrderBook();
		else this.props.subscribeOrderBook(token);
		this.setState({ tradeToken: token });
	};

	public render() {
		const {
			account,
			tokens,
			acceptedPrices,
			custodians,
			custodianTokenBalances,
			ethBalance,
			connection,
			orderBook,
			ethPrice
		} = this.props;
		const { convertCustodian, tradeToken, convertAToken, convertBToken } = this.state;
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
						<SDivFlexCenter center horizontal marginBottom="20px" style={{ paddingTop: '20px' }}>
							{beethovenList.map(c => (
								<CustodianCard
									key={c}
									type={CST.BEETHOVEN}
									handleConvert={this.handleConvert}
									handleTrade={this.handleTrade}
									info={custodians[c]}
									margin="0 10px"
									acceptedPrices={acceptedPrices[c]}
									tokenBalances={custodianTokenBalances[c] || {}}
								/>
							))}
						</SDivFlexCenter>
						<SDivFlexCenter center horizontal marginBottom="60px">
							{mozartList.map(c => (
								<CustodianCard
									key={c}
									type={CST.MOZART}
									handleConvert={this.handleConvert}
									handleTrade={this.handleTrade}
									info={custodians[c]}
									margin="0 10px"
									acceptedPrices={acceptedPrices[c]}
									tokenBalances={custodianTokenBalances[c] || {}}
								/>
							))}
						</SDivFlexCenter>
						<ConvertCard
							account={account}
							tokenBalances={custodianTokenBalances[convertCustodian]}
							ethBalance={ethBalance}
							custodian={convertCustodian}
							aToken={convertAToken}
							bToken={convertBToken}
							info={custodians[convertCustodian]}
							handleClose={() => this.handleConvert('', '', '')}
						/>
						<TradeCard
							account={account}
							token={tradeToken}
							tokenInfo={tradeTokenInfo}
							tokenBalance={tradeTokenBalance}
							ethBalance={ethBalance}
							orderBook={orderBook}
							ethPrice={ethPrice}
							handleClose={() => this.handleTrade('')}
						/>
					</Spin>
				</div>
			</Layout>
		);
	}
}
