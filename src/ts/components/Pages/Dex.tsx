import { Layout, Spin } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import {
	IAcceptedPrice,
	ICustodianInfo,
	IEthBalance,
	IOrderBookSnapshot,
	IToken,
	ITokenBalance,
	IUserOrder
} from 'ts/common/types';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
import ConvertCard from '../Cards/ConvertCard';
import CustodianCard from '../Cards/CustodianCard';
import OrderHistoryCard from '../Cards/OrderHistoryCard';
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
	orderHistory: { [pair: string]: IUserOrder[] };
	connection: boolean;
	subscribeOrderBook: (pair: string) => any;
	unsubscribeOrderBook: () => any;
	subscribeOrder: (account: string) => any;
	unsubscribeOrder: () => any;
}

interface IState {
	account: string;
	convertCustodian: string;
	convertAToken: string;
	convertBToken: string;
	tradeToken: string;
	showHistory: boolean;
}

export default class Dex extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			account: props.account,
			convertCustodian: '',
			convertAToken: '',
			convertBToken: '',
			tradeToken: '',
			showHistory: false
		};
	}

	public componentDidMount() {
		document.title = 'DUO | Trustless Derivatives';
		this.props.subscribeOrder(this.props.account);
	}

	public static getDerivedStateFromProps(props: IProps, state: IState) {
		if (props.account !== state.account) {
			props.unsubscribeOrder();
			props.subscribeOrder(props.account);
			return {
				account: props.account
			};
		}

		return null;
	}

	public componentWillUnmount() {
		this.props.unsubscribeOrder();
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

	public toggleHistory = () => this.setState({ showHistory: !this.state.showHistory });

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
			ethPrice,
			orderHistory
		} = this.props;
		const {
			convertCustodian,
			tradeToken,
			convertAToken,
			convertBToken,
			showHistory
		} = this.state;
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
					<Header toggleHistory={this.toggleHistory} />
					<Spin spinning={!connection} tip="loading...">
						<SDivFlexCenter
							center
							horizontal
							marginBottom="20px"
							style={{ paddingTop: '20px' }}
						>
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
						<OrderHistoryCard
							orderHistory={orderHistory}
							account={account}
							display={showHistory}
						/>
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
