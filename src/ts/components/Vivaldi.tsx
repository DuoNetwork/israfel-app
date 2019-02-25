//import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { IAcceptedPrice } from '@finbook/duo-market-data';
import { Constants, IOrderBookSnapshot, IToken, ITrade, IUserOrder } from '@finbook/israfel-common';
import eth from 'images/ethIconB.png';
import down from 'images/vivaldi/downW.png';
import graph from 'images/vivaldi/GraphCard.png';
import placeHolder from 'images/vivaldi/Mobile.png';
import up from 'images/vivaldi/upW.png';
//import user from 'images/vivaldi/user.png';
import moment from 'moment';
import * as React from 'react';
import Countdown from 'react-countdown-now';
import MediaQuery from 'react-responsive';
import {
	ICustodianInfo,
	IEthBalance,
	INotification,
	ITokenBalance,
	IVivaldiCustodianInfo
} from 'ts/common/types';
import util from 'ts/common/util';
import {
	SDesCard,
	SDivFlexCenter,
	SGraphCard,
	SInfoCard,
	SPayoutCard,
	SUserCount,
	SVHeader
} from './_styledV';
import VivaldiBetCard from './Cards/VivaldiBetCard';

interface IProps {
	types: string[];
	network: number;
	locale: string;
	tokens: IToken[];
	account: string;
	ethBalance: IEthBalance;
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	ethPrice: number;
	trades: { [pair: string]: ITrade[] };
	custodians: { [custodian: string]: ICustodianInfo };
	custodianTokenBalances: { [custodian: string]: { [code: string]: ITokenBalance } };
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	orderHistory: { [pair: string]: IUserOrder[] };
	connection: boolean;
	wethAddress: string;
	notify: (notification: INotification) => any;
	subscribeOrder: (account: string) => any;
	unsubscribeOrder: () => any;
	wrapEther: (amount: number, address: string) => Promise<string>;
	unwrapEther: (amount: number, address: string) => Promise<string>;
	setUnlimitedTokenAllowance: (code: string, account: string, spender?: string) => any;
	web3PersonalSign: (account: string, message: string) => Promise<string>;
	addOrder: (
		account: string,
		pair: string,
		price: number,
		amount: number,
		isBid: boolean,
		expiry: number
	) => Promise<string>;
	deleteOrder: (pair: string, orderHashes: string[], signature: string) => void;
}
interface IState {
	connection: boolean;
	account: string;
	openBetCard: boolean;
	entryTag: number;
	// pair: string;
}
export default class Vivaldi extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			connection: props.connection,
			account: props.account,
			openBetCard: false,
			entryTag: 2
		};
	}

	public componentDidMount() {
		document.title = 'DUO | Trustless Derivatives';
		this.props.subscribeOrder(this.props.account);
	}

	public static getDerivedStateFromProps(props: IProps, state: IState) {
		if (props.connection !== state.connection || props.account !== state.account) {
			if (props.connection) props.subscribeOrder(props.account);
			else props.unsubscribeOrder();
			return {
				connection: props.connection,
				account: props.account
			};
		}

		return null;
	}

	public componentWillUnmount() {
		this.props.unsubscribeOrder();
	}

	public handleBetCard = (entry?: number) => {
		this.setState({
			openBetCard: !this.state.openBetCard,
			entryTag: entry ? entry : this.state.entryTag
		});
	};

	public handleBetCardTag = (tag: number) => {
		this.setState({
			entryTag: tag
		});
	};

	private getPrevRoundReturn = (isKnockedIn: boolean, code: string, userOrders: IUserOrder[]) => {
		let accumulatedPayout = 0;
		let totalEthPaid = 0;

		for (const userOrder of userOrders)
			if (userOrder.type === Constants.DB_TERMINATE && userOrder.fill > 0) {
				if (code.toLowerCase().includes('c')) {
					accumulatedPayout += isKnockedIn
						? userOrder.fill
						: 0 - userOrder.price * userOrder.fill;
					totalEthPaid += userOrder.price * userOrder.fill;
				}
			} else {
				accumulatedPayout += isKnockedIn
					? 0
					: userOrder.fill - userOrder.price * userOrder.fill;
				totalEthPaid += userOrder.price * userOrder.fill;
			}

		return [accumulatedPayout, totalEthPaid];
	};

	private getCurrentRoundExpectedReturn = (userOrders: IUserOrder[]) => {
		let accumulatedPayout = 0;
		let totalEthPaid = 0;
		for (const userOrder of userOrders)
			if (userOrder.type === Constants.DB_TERMINATE && userOrder.fill > 0) {
				accumulatedPayout += userOrder.fill - userOrder.price * userOrder.fill;
				totalEthPaid += userOrder.price * userOrder.fill;
			}
		return [accumulatedPayout, totalEthPaid];
	};

	public render() {
		const { ethPrice, types, custodians, orderBooks, ethBalance } = this.props;
		const { openBetCard, entryTag } = this.state;

		const renderer = ({ hours, minutes, seconds, completed }: any) => {
			if (completed) return <span>Settling</span>;
			else
				return (
					<span>
						{util.fillZero(hours)}:{util.fillZero(minutes)}:{util.fillZero(seconds)}
					</span>
				);
		};

		const custodianTypeList: string[][] = types.map(() => []);
		for (const custodian in custodians) {
			const info = custodians[custodian];
			const code = info.code.toLowerCase();
			for (let i = 0; i < types.length; i++)
				if (code.startsWith(types[i].toLowerCase())) {
					custodianTypeList[i].push(custodian);
					break;
				}
		}
		custodianTypeList.forEach(list =>
			list.sort((a, b) => custodians[a].states.maturity - custodians[b].states.maturity)
		);

		const infoV: IVivaldiCustodianInfo = custodians[custodianTypeList[0] as any] as any;
		const upDownClass = infoV
			? infoV.states.roundStrike < ethPrice
				? 'incPx'
				: 'decPx'
			: 'loading';
		const upDownText = infoV ? (infoV.states.roundStrike < ethPrice ? 'UP' : 'DOWN') : '···';
		const upDownChange = infoV
			? '$' +
			  util.formatPriceShort(Math.abs(infoV.states.roundStrike - ethPrice)) +
			  ' (' +
			  util.formatPercentAcc(
					Math.abs(infoV.states.roundStrike - ethPrice) / infoV.states.roundStrike
			  ) +
			  ')'
			: '··· (···)';
		const Endtime = infoV
			? infoV.states.resetPriceTime + infoV.states.period
			: moment().valueOf();
		const roundStrike = infoV ? infoV.states.roundStrike : 0;
		const codeV = infoV ? infoV.code : '';

		let prevRoundPayout = 0;
		let prevRoundInvest = 0;
		let currentRoundInvest = 0;
		let currentRoundPayout = 0;
		let pair = '';
		switch (entryTag) {
			case 1:
				pair = 'ETH-100P-3H' + `|${Constants.TOKEN_WETH}`;
				break;
			case 2:
				pair = 'ETH-100C-3H' + `|${Constants.TOKEN_WETH}`;
				break;
			default:
				break;
		}

		if (infoV && this.props.orderHistory[pair]) {
			const isKnockedIn = infoV.states.isKnockedIn;
			const lastResetTime = infoV.states.resetPriceTime;

			const prevRoundUserOrders = (this.props.orderHistory[pair] as IUserOrder[]).filter(
				uo =>
					uo.createdAt <= lastResetTime &&
					uo.createdAt >= lastResetTime - infoV.states.period &&
					uo.side === Constants.DB_BID &&
					uo.pair === pair
			);
			if (prevRoundUserOrders.length > 0)
				[prevRoundPayout, prevRoundInvest] = this.getPrevRoundReturn(
					isKnockedIn,
					codeV,
					prevRoundUserOrders
				);

			const currentRoundUserOrders = (this.props.orderHistory[pair] as IUserOrder[]).filter(
				uo =>
					uo.createdAt > lastResetTime && uo.side === Constants.DB_BID && uo.pair === pair
			);
			if (currentRoundUserOrders.length > 0)
				[currentRoundPayout, currentRoundInvest] = this.getCurrentRoundExpectedReturn(
					currentRoundUserOrders
				);
		}

		return (
			<div>
				<MediaQuery minDeviceWidth={900}>
					<header>
						Vivaldi <span>Prediction Market</span>
					</header>
					<div className="img-wrapper">
						<img src={placeHolder} />
						<h3>
							Please use mobile phone to access to <b>Vivaldi</b>.
						</h3>
					</div>
				</MediaQuery>
				<MediaQuery maxDeviceWidth={899}>
					<SVHeader>
						<div className="title">
							ETH
							<img src={eth} />
						</div>
						<div className="logo-wrapper">
							<b>Vivaldi</b>
							<b>Prediction</b>
							<b>Market</b>
						</div>
					</SVHeader>
					<SInfoCard>
						<div className="info-bar">
							<div className="info-bar-left">
								<div className="info-title">Ethereum</div>
								<div className="info-price">{`$${util.formatPriceShort(
									ethPrice
								)}`}</div>
							</div>
							<div
								className={
									(openBetCard ? 'showMini' : 'hideMini') + ' info-bar-right'
								}
							>
								Mini Graph
							</div>
						</div>
						<div className="subtitle-bar">
							<span className={upDownClass + ' updown-button'}>{upDownText}</span>
							<span className={upDownClass + 'T change-button'}>{upDownChange}</span>
							<span className="game-button">current game</span>
						</div>
					</SInfoCard>
					<SGraphCard>
						<img src={graph} />
					</SGraphCard>
					<SDesCard>
						<div>
							Where do you think the price of <b>ETH</b> is going in
						</div>
						<div className="count-down">
							<Countdown date={Endtime} renderer={renderer} />
						</div>
					</SDesCard>
					<SDivFlexCenter horizontal padding="12px 20%">
						<SUserCount>
							{/* <div>
								<img className="user-img" src={user} />
								123
							</div> */}
							<div className="ud-img down-img" onClick={() => this.handleBetCard(1)}>
								<img src={down} />
							</div>
						</SUserCount>
						<SUserCount>
							<div className="ud-img up-img" onClick={() => this.handleBetCard(2)}>
								<img src={up} />
							</div>
							{/* <div>
								<img className="user-img" src={user} />
								123
							</div> */}
						</SUserCount>
					</SDivFlexCenter>
					<SPayoutCard>
						<div className="title">
							My Payouts{' '}
							<span
								className={entryTag === 0 || entryTag === 1 ? 'downSpan' : 'upSpan'}
							>
								{entryTag === 0 || entryTag === 1 ? '(down)' : '(up)'}
							</span>
						</div>
						<div className="section">
							<h3>Current Game</h3>
							<div className="row">
								<div className="col1">
									<h4 className="col-title"># OF ETH SPENT</h4>
									<h4 className="col-content">
										{util.formatNumber(currentRoundInvest)}
									</h4>
								</div>
								<div className="col2">
									<h4 className="col-title">EXPECTED RETURN</h4>
									<h4 className="col-content">
										{util.formatNumber(currentRoundPayout)}
									</h4>
								</div>
								<div className="col3">
									<h4 className="col-content increase">
										{util.formatPercent(
											currentRoundInvest
												? currentRoundPayout / currentRoundInvest
												: 0
										)}
									</h4>
								</div>
							</div>
						</div>
						<div className="section">
							<h3>Previous Game</h3>
							<div className="row">
								<div className="col1">
									<h4 className="col-title"># OF ETH SPENT</h4>
									<h4 className="col-content">
										{util.formatNumber(prevRoundInvest)}
									</h4>
								</div>
								<div className="col2">
									<h4 className="col-title"># OF ETH RETURN</h4>
									<h4 className="col-content">
										{util.formatNumber(prevRoundPayout)}
									</h4>
								</div>
								<div className="col3">
									<h4 className="col-content decrease">
										{util.formatPercent(
											prevRoundInvest ? prevRoundPayout / prevRoundInvest : 0
										)}
									</h4>
								</div>
							</div>
						</div>
					</SPayoutCard>
					<VivaldiBetCard
						pair={pair}
						account={this.props.account}
						code={codeV}
						tokens={this.props.tokens}
						ethBalance={ethBalance}
						orderBooks={orderBooks}
						cardOpen={openBetCard}
						endTime={Endtime}
						entryTag={entryTag}
						downdownPrice={140}
						downPrice={roundStrike}
						upPrice={roundStrike}
						upupPrice={160}
						onCancel={this.handleBetCard}
						onTagChange={this.handleBetCardTag}
						addOrder={this.props.addOrder}
					/>
				</MediaQuery>
			</div>
		);
	}
}
