import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { IPrice } from '@finbook/duo-market-data';
import {
	Constants,
	IOrderBookSnapshot,
	IToken,
	IUserOrder,
	Util as CommonUtil
} from '@finbook/israfel-common';
import eth from 'images/ethIconB.png';
import down from 'images/vivaldi/downW.png';
import placeHolder from 'images/vivaldi/Mobile.png';
import up from 'images/vivaldi/upW.png';
import moment from 'moment';
import * as React from 'react';
import Countdown from 'react-countdown-now';
import MediaQuery from 'react-responsive';
import * as CST from 'ts/common/constants';
import { ICustodianInfo, IEthBalance, ITokenBalance, IVivaldiCustodianInfo } from 'ts/common/types';
import util from 'ts/common/util';
import {
	SAllowenceCard,
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
	ethPrice: number;
	exchangePrices: IPrice[];
	custodians: { [custodian: string]: ICustodianInfo };
	custodianTokenBalances: { [custodian: string]: { [code: string]: ITokenBalance } };
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	orderHistory: { [pair: string]: IUserOrder[] };
	connection: boolean;
	wethAddress: string;
	titleN: string;
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
	wrapEther: (amount: number, address: string) => Promise<string>;
	setUnlimitedTokenAllowance: (code: string, account: string, spender?: string) => any;
}
interface IState {
	connection: boolean;
	account: string;
	isBetCardOpen: boolean;
	vivaldiIndex: number;
	isCall: boolean;
	ethInput: string;
	inProgress: boolean;
}
export default class Vivaldi extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			vivaldiIndex: 0,
			connection: props.connection,
			account: props.account,
			isBetCardOpen: false,
			isCall: true,
			ethInput: '',
			inProgress: false
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

	public toggleBetCard = (isCall: boolean) => {
		this.setState({
			isBetCardOpen: !this.state.isBetCardOpen,
			isCall: isCall
		});
	};

	public selectBetType = (vivaldiIndex: number, isCall: boolean) => {
		this.setState({
			vivaldiIndex: vivaldiIndex,
			isCall: isCall
		});
	};
	private handleWrap = () => {
		const { wrapEther, account } = this.props;
		const { ethInput } = this.state;

		if (ethInput.match(CST.RX_NUM_P))
			wrapEther(Number(ethInput), account).then(() => this.setState({ ethInput: '' }));
		else this.setState({ ethInput: '' });
	};

	private handleETHInputChange = (value: string) =>
		this.setState({
			ethInput: value
		});

	private getPrevRoundReturn = (isKnockedIn: boolean, userOrders: IUserOrder[]) => {
		let accumulatedPayout = 0;
		let totalEthPaid = 0;

		const processed: { [orderHash: string]: boolean } = {};

		userOrders.forEach(uo => {
			const { orderHash, price, fill } = uo;
			if (processed[orderHash]) return;
			processed[orderHash] = true;
			if (fill > 0) {
				totalEthPaid += price * fill;
				accumulatedPayout += isKnockedIn ? fill : 0;
			}
		});

		return [accumulatedPayout, totalEthPaid];
	};

	private getCurrentRoundExpectedReturn = (userOrders: IUserOrder[]) => {
		let accumulatedPayout = 0;
		let totalEthPaid = 0;

		const processed: { [orderHash: string]: boolean } = {};

		userOrders.forEach(uo => {
			const { orderHash, price, fill } = uo;
			if (processed[orderHash]) return;
			processed[orderHash] = true;
			if (fill > 0) {
				accumulatedPayout += fill - price * fill;
				totalEthPaid += price * fill;
			}
		});

		return [accumulatedPayout, totalEthPaid];
	};

	public render() {
		const {
			account,
			ethPrice,
			types,
			custodians,
			orderBooks,
			ethBalance,
			exchangePrices,
			setUnlimitedTokenAllowance,
			titleN
		} = this.props;
		const { isBetCardOpen, isCall, vivaldiIndex, ethInput } = this.state;

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

		let pair = '';
		let upDownChange = '··· (···)';
		let upDownClass = 'loading';
		let Endtime = moment().valueOf();
		let roundStrike = 0;
		let prevRoundPayout = 0;
		let prevRoundInvest = 0;
		let currentRoundInvest = 0;
		let currentRoundPayout = 0;
		if (infoV) {
			roundStrike = infoV.states.roundStrike;
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
						(isKnockedIn && isCall) || (!isKnockedIn && !isCall),
						prevRoundUserOrders.sort((a, b) => -a.currentSequence + b.currentSequence)
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
						currentRoundUserOrders.sort(
							(a, b) => -a.currentSequence + b.currentSequence
						)
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
								<div className="subtitle-bar">
									<span className={upDownClass + 'T change-button'}>
										{upDownChange}
									</span>
									<span className="game-button">current game</span>
								</div>
							</div>
							<div className="info-bar-right">
								Balance
								<p>
									<div>ETH</div>
									<div>{util.formatBalance(ethBalance.eth)}</div>
								</p>
								<p>
									<div>WETH</div>
									<div>{util.formatBalance(ethBalance.weth)}</div>
								</p>
								<div className="input-line">
									<input
										placeholder="input wrap nubmer"
										value={ethInput}
										onChange={e => this.handleETHInputChange(e.target.value)}
									/>
									<div onClick={this.handleWrap}>WRAP</div>
								</div>
							</div>
						</div>
					</SInfoCard>
					<SGraphCard>
						<VivaldiChart
							prices={exchangePrices ? exchangePrices : []}
							ethPrice={ethPrice}
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
					<SDivFlexCenter horizontal padding="12px 20%" className="up-down-wrapper">
						<SUserCount>
							{/* <div>
								<img className="user-img" src={user} />
								123
							</div> */}
							<div
								className="ud-img down-img"
								onClick={() =>
									orderBooks[pair] ? this.toggleBetCard(false) : null
								}
							>
								<img src={down} />
							</div>
						</SUserCount>
						<SUserCount>
							<div
								className="ud-img up-img"
								onClick={() => (orderBooks[pair] ? this.toggleBetCard(true) : null)}
							>
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
							My Payouts
						</div>
						<div className="section">
							<h3>Current Game</h3>
							<div className="row">
								<div className="col3">
									<h4 className="col-content downSpan">
										PUT
									</h4>
									<h4 className="col-content upSpan">
										CALL
									</h4>
								</div>
								<div className="col1">
									<h4 className="col-title"># OF ETH SPENT</h4>
									<h4 className="col-content">
										{util.formatNumber(currentRoundInvest)}
									</h4>
									<h4 className="col-content">
										{util.formatNumber(currentRoundInvest)}
									</h4>
								</div>
								<div className="col2">
									<h4 className="col-title">EXPECTED RETURN</h4>
									<h4 className="col-content">
										{util.formatNumber(currentRoundPayout)}
									</h4>
									<h4 className="col-content">
										{util.formatNumber(currentRoundInvest)}
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
									<h4
										className={
											(prevRoundPayout >= prevRoundInvest
												? 'increase'
												: 'decrease') + ' col-content'
										}
									>
										{util.formatPercent(
											prevRoundInvest
												? prevRoundPayout / prevRoundInvest - 1
												: 0
										)}
									</h4>
								</div>
							</div>
						</div>
					</SPayoutCard>
					<VivaldiBetCard
						pair={pair}
						account={this.props.account}
						token={this.props.tokens.find(t => pair.startsWith(t.code))}
						ethBalance={ethBalance}
						orderBookSnapshot={orderBooks[pair]}
						isBetCardOpen={isBetCardOpen}
						endTime={Endtime}
						vivaldiIndex={vivaldiIndex}
						isCall={isCall}
						downdownPrice={140}
						downPrice={roundStrike}
						upPrice={roundStrike}
						upupPrice={160}
						onCancel={this.toggleBetCard}
						onGameTypeChange={this.selectBetType}
						addOrder={this.props.addOrder}
						markUp={0.01}
						titleN={titleN}
					/>
					{ethBalance.eth && ethBalance.weth === 0 ? (
						<SAllowenceCard>
							<div className="allowenceWrapper">
								<p>
									Not enough <b>WETH</b>, please get some <b>WETH</b> for further
									transaction.
								</p>
								<input
									placeholder="input wrap nubmer"
									value={ethInput}
									onChange={e => this.handleETHInputChange(e.target.value)}
								/>
								<div className="allow-button" onClick={this.handleWrap}>
									Wrap
								</div>
							</div>
						</SAllowenceCard>
					) : null}
					{ethBalance.weth && ethBalance.allowance === 0 ? (
						<SAllowenceCard>
							<div className="allowenceWrapper">
								<p>
									Not enough <b>WETH Allowence</b>, please comfirm allowence for
									further transaction.
								</p>
								<div
									className="allow-button"
									onClick={() => setUnlimitedTokenAllowance('WETH', account)}
								>
									ALLOW
								</div>
							</div>
						</SAllowenceCard>
					) : null}
				</MediaQuery>
			</div>
		);
	}
}
