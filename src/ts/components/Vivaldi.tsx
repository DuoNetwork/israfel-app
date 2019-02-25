//import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { IAcceptedPrice, IPrice } from '@finbook/duo-market-data';
import {
	Constants,
	IOrderBookSnapshot,
	IToken,
	IUserOrder,
	Util as CommonUtil
} from '@finbook/israfel-common';
import eth from 'images/ethIconB.png';
import down from 'images/vivaldi/downW.png';
//import graph from 'images/vivaldi/GraphCard.png';
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
import VivaldiChart from './Charts/VivaldiChart';

interface IProps {
	types: string[];
	network: number;
	locale: string;
	tokens: IToken[];
	account: string;
	ethBalance: IEthBalance;
	acceptedPrices: { [custodian: string]: IAcceptedPrice[] };
	ethPrice: number;
	exchangePrices: IPrice[];
	custodians: { [custodian: string]: ICustodianInfo };
	custodianTokenBalances: { [custodian: string]: { [code: string]: ITokenBalance } };
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	orderHistory: { [pair: string]: IUserOrder[] };
	connection: boolean;
	wethAddress: string;
	notify: (notification: INotification) => any;
	subscribeOrder: (account: string) => any;
	unsubscribeOrder: () => any;
	addOrder: (
		account: string,
		pair: string,
		price: number,
		amount: number,
		isBid: boolean,
		expiry: number
	) => Promise<string>;
}
interface IState {
	connection: boolean;
	account: string;
	isBetCardOpen: boolean;
	vivaldiIndex: number;
	isCall: boolean;
}
export default class Vivaldi extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			vivaldiIndex: 0,
			connection: props.connection,
			account: props.account,
			isBetCardOpen: false,
			isCall: true
		};
	}

	public componentDidMount() {
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
			isBetCardOpen: !this.state.isBetCardOpen,
			isCall: entry ? (entry === 2 ? true : false) : this.state.isCall
		});
	};

	public handleBetCardTag = ( vivaldiIndex: number, isCall: boolean) => {
		this.setState({
			vivaldiIndex: vivaldiIndex,
			isCall: isCall
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
		const { ethPrice, types, custodians, orderBooks, ethBalance, exchangePrices } = this.props;
		const { isBetCardOpen, isCall, vivaldiIndex } = this.state;

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

		const infoV: IVivaldiCustodianInfo = custodians[
			custodianTypeList[vivaldiIndex] as any
		] as any;

		let codeV = '';
		let pair = '';
		let upDownChange = '··· (···)';
		let upDownClass = 'loading';
		let upDownText = '···';
		let Endtime = moment().valueOf();
		let roundStrike = 0;
		let prevRoundPayout = 0;
		let prevRoundInvest = 0;
		let currentRoundInvest = 0;
		let currentRoundPayout = 0;
		if (infoV) {
			codeV = infoV.code;
			roundStrike = infoV.states.roundStrike;
			upDownText = infoV.states.roundStrike < ethPrice ? 'UP' : 'DOWN';
			upDownClass = infoV.states.roundStrike < ethPrice ? 'incPx' : 'decPx';
			Endtime = infoV.states.resetPriceTime + infoV.states.period;
			upDownChange =
				'$' +
				util.formatPriceShort(Math.abs(infoV.states.roundStrike - ethPrice)) +
				' (' +
				util.formatPercentAcc(
					Math.abs(infoV.states.roundStrike - ethPrice) / infoV.states.roundStrike
				) +
				')';
			pair =
				(isCall
					? infoV.code.replace(WrapperConstants.VIVALDI.toUpperCase(), Constants.ETH)
					: infoV.code
							.replace(WrapperConstants.VIVALDI.toUpperCase(), Constants.ETH)
							.replace('C', 'P')) + `|${Constants.TOKEN_WETH}`;

			if (this.props.orderHistory[pair]) {
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

				const currentRoundUserOrders = (this.props.orderHistory[
					pair
				] as IUserOrder[]).filter(
					uo =>
						uo.createdAt > lastResetTime &&
						uo.side === Constants.DB_BID &&
						uo.pair === pair
				);
				if (currentRoundUserOrders.length > 0)
					[currentRoundPayout, currentRoundInvest] = this.getCurrentRoundExpectedReturn(
						currentRoundUserOrders
					);
			}
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
							{/* <div
								className={
									(isBetCardOpen ? 'showMini' : 'hideMini') + ' info-bar-right'
								}
							>
								Mini Graph
							</div> */}
						</div>
						<div className="subtitle-bar">
							<span className={upDownClass + ' updown-button'}>{upDownText}</span>
							<span className={upDownClass + 'T change-button'}>{upDownChange}</span>
							<span className="game-button">current game</span>
						</div>
					</SInfoCard>
					<SGraphCard>
						<VivaldiChart
							prices={exchangePrices ? exchangePrices : []}
							innerWidth={window.innerWidth * 0.92}
							resetTime={
								infoV
									? infoV.states.resetPriceTime
									: CommonUtil.getUTCNowTimestamp()
							}
						/>
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
							<span className={isCall ? 'upSpan' : 'downSpan'}>
								{isCall ? '(up)' : '(down)'}
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
						tokens={this.props.tokens}
						ethBalance={ethBalance}
						orderBooks={orderBooks}
						isBetCardOpen={isBetCardOpen}
						endTime={Endtime}
						vivaldiIndex={vivaldiIndex}
						isCall={isCall}
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
