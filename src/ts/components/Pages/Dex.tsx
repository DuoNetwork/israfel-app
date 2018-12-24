import { Spin } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import {
	IAcceptedPrice,
	ICustodianInfo,
	IEthBalance,
	INotification,
	IOrderBookSnapshot,
	IToken,
	ITokenBalance,
	IUserOrder
} from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import BalanceCard from '../Cards/BalanceCard';
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
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	orderHistory: { [pair: string]: IUserOrder[] };
	connection: boolean;
	notify: (notification: INotification) => any;
	subscribeOrder: (account: string) => any;
	unsubscribeOrder: () => any;
}

interface IState {
	account: string;
	convertCustodian: string;
	convertAToken: string;
	convertBToken: string;
	tradeToken: string;
	showBalances: boolean;
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
			showBalances: true
		};
	}

	public componentDidMount() {
		document.title = 'DUO | Trustless Derivatives';
		this.props.subscribeOrder(this.props.account);
	}

	public static getDerivedStateFromProps(props: IProps, state: IState) {
		if (props.account !== state.account) {
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

	public handleTrade = (token: string) => this.setState({ tradeToken: token });

	public render() {
		const {
			account,
			tokens,
			acceptedPrices,
			custodians,
			custodianTokenBalances,
			ethBalance,
			connection,
			orderBooks,
			ethPrice,
			orderHistory,
			notify
		} = this.props;
		const {
			convertCustodian,
			tradeToken,
			convertAToken,
			convertBToken,
			showBalances
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
		const tokenInterestOrLeverage =
			tradeTokenInfo &&
			acceptedPrices[tradeTokenInfo.custodian] &&
			acceptedPrices[tradeTokenInfo.custodian].length
				? util.getTokenInterestOrLeverage(
						custodians[tradeTokenInfo.custodian],
						acceptedPrices[tradeTokenInfo.custodian][
							acceptedPrices[tradeTokenInfo.custodian].length - 1
						],
						tradeToken.startsWith('a') || tradeToken.startsWith('s')
				)
				: 0;
		let tokenNavInEth = 0;
		let tokenNavUpdatedAt = 0;
		if (tradeTokenInfo && custodians[tradeTokenInfo.custodian]) {
			if (tradeToken.startsWith('a') || tradeToken.startsWith('s'))
				tokenNavInEth = custodians[tradeTokenInfo.custodian].states.navA / ethPrice;
			else tokenNavInEth = custodians[tradeTokenInfo.custodian].states.navB / ethPrice;

			tokenNavUpdatedAt = custodians[tradeTokenInfo.custodian].states.lastPriceTime;
		}

		return (
			<div>
				<Spin spinning={!connection} tip="loading...">
					<SDivFlexCenter
						center
						horizontal
						marginBottom="20px"
						style={{ paddingTop: '20px' }}
					>
						{beethovenList.map(c => {
							const tbs = custodianTokenBalances[c] || {};
							const obs: { [pair: string]: IOrderBookSnapshot } = {};
							for (const code in tbs) {
								const pair = code + '|' + CST.TH_WETH;
								obs[pair] = orderBooks[pair];
							}
							return (
								<CustodianCard
									key={c}
									type={CST.BEETHOVEN}
									custodian={c}
									handleConvert={this.handleConvert}
									handleTrade={this.handleTrade}
									info={custodians[c]}
									margin="0 10px"
									acceptedPrices={acceptedPrices[c]}
									tokenBalances={tbs}
									orderBooks={obs}
									ethPrice={ethPrice}
								/>
							);
						})}
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal marginBottom="20px">
						{mozartList.map(c => {
							const tbs = custodianTokenBalances[c] || {};
							const obs: { [pair: string]: IOrderBookSnapshot } = {};
							for (const code in tbs) {
								const pair = code + '|' + CST.TH_WETH;
								obs[pair] = orderBooks[pair];
							}
							return (
								<CustodianCard
									key={c}
									type={CST.MOZART}
									custodian={c}
									handleConvert={this.handleConvert}
									handleTrade={this.handleTrade}
									info={custodians[c]}
									margin="0 10px"
									acceptedPrices={acceptedPrices[c]}
									tokenBalances={tbs}
									orderBooks={obs}
									ethPrice={ethPrice}
								/>
							);
						})}
					</SDivFlexCenter>
					<OrderHistoryCard orderHistory={orderHistory} account={account} />
					<ConvertCard
						account={account}
						tokenBalances={custodianTokenBalances[convertCustodian]}
						ethBalance={ethBalance}
						custodian={convertCustodian}
						aToken={convertAToken}
						bToken={convertBToken}
						info={custodians[convertCustodian]}
						notify={notify}
						handleClose={() => this.handleConvert('', '', '')}
					/>
					<TradeCard
						account={account}
						token={tradeToken}
						tokenInfo={tradeTokenInfo}
						tokenBalance={tradeTokenBalance}
						ethBalance={ethBalance}
						orderBook={
							orderBooks[tradeToken + '|' + CST.TH_WETH] || {
								pair: 'pair',
								version: 0,
								bids: [],
								asks: []
							}
						}
						ethPrice={ethPrice}
						navInEth={tokenNavInEth}
						navUpdatedAt={tokenNavUpdatedAt}
						notify={notify}
						interestOrLeverage={tokenInterestOrLeverage}
						handleClose={() => this.handleTrade('')}
					/>
				</Spin>
				<BalanceCard
					ethPrice={ethPrice}
					visible={showBalances}
					account={account}
					ethBalance={ethBalance}
					beethovenList={beethovenList}
					mozartList={mozartList}
					custodians={custodians}
					custodianTokenBalances={custodianTokenBalances}
					notify={notify}
					handleClose={() => this.setState({ showBalances: !showBalances })}
				/>
			</div>
		);
	}
}
