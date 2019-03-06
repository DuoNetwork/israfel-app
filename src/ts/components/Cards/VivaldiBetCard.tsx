import { IOrderBookSnapshot, IToken, Util as CommonUtil } from '@finbook/israfel-common';
import bear from 'images/vivaldi/bear.png';
import bull from 'images/vivaldi/bull.png';
import down from 'images/vivaldi/downW.png';
//import up2 from 'images/vivaldi/upupW.png';
import up from 'images/vivaldi/upW.png';
//import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as React from 'react';
import Countdown from 'react-countdown-now';
import { IEthBalance } from 'ts/common/types';
import util from 'ts/common/util';
import {
	SBetInfoWrapper,
	SCardButtonWrapper,
	SNotice,
	SSliderWrapper,
	STagWrapper,
	SVBetCard
} from './_styledV';

interface IProps {
	pair: string;
	vivaldiIndex: number;
	isCall: boolean;
	account: string;
	token?: IToken;
	ethBalance: IEthBalance;
	orderBookSnapshot: IOrderBookSnapshot;
	isBetCardOpen: boolean;
	endTime: number;
	downdownPrice: number;
	downPrice: number;
	upPrice: number;
	upupPrice: number;
	markUp: number;
	titleN: string;
	onBuy?: () => void;
	onCancel: (isCall: boolean) => void;
	onGameTypeChange: (vivaldiIndex: number, isCall: boolean) => void;
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
	betNumber: number;
	betPrice: number;
	isCall: boolean;
	vivaldiIndex: number;
	orderBookSnapshot: IOrderBookSnapshot;
	zeroRate: number;
	showNotice: boolean;
	titleN: string;
}

export default class VivaldiBetCard extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			betNumber: 0,
			betPrice: 0,
			isCall: props.isCall,
			vivaldiIndex: props.vivaldiIndex,
			orderBookSnapshot: props.orderBookSnapshot,
			zeroRate: 0,
			showNotice: false,
			titleN: props.titleN
		};
	}
	public static getDerivedStateFromProps(props: IProps, state: IState) {
		if (JSON.stringify(props.titleN) !== JSON.stringify(state.titleN)) {
			return {
				showNotice: true,
				titleN: props.titleN
			};

		}
		if (props.isCall !== state.isCall || props.vivaldiIndex !== state.vivaldiIndex) {
			let amt = 0;
			let price = 0;
			let zeroRate = 0;
			for (const orderBookLevel of props.orderBookSnapshot.asks) {
				amt += orderBookLevel.balance;
				price = orderBookLevel.price + props.markUp;
				if (amt >= 0.1) zeroRate = 1 / price - 1;
			}
			return {
				betNumber: 0,
				betPrice: 0,
				isCall: props.isCall,
				vivaldiIndex: props.vivaldiIndex,
				zeroRate: zeroRate,
				titleN: props.titleN
			};
		}
		if (props.orderBookSnapshot !== state.orderBookSnapshot && props.orderBookSnapshot) {
			let amt = 0;
			let price = 0;
			let zeroRate = 0;
			for (const orderBookLevel of props.orderBookSnapshot.asks) {
				amt += orderBookLevel.balance;
				price = orderBookLevel.price + props.markUp;
				if (amt >= 0.1) zeroRate = 1 / price - 1;
			}
			return { zeroRate: zeroRate, titleN: props.titleN };
		}
		return null;
	}

	private getPrice = (
		ddP: number,
		dP: number,
		uP: number,
		uuP: number,
		vivaldiIndex: number,
		isCall: boolean
	) => {
		if (isCall)
			return vivaldiIndex === 0
				? uP
					? '$' + util.formatStrike(uP)
					: '···'
				: uuP
				? '$' + util.formatStrike(uuP)
				: '···';
		else
			return vivaldiIndex === 0
				? dP
					? '$' + util.formatStrike(dP)
					: '···'
				: ddP
				? '$' + util.formatStrike(ddP)
				: '···';
	};
	// private closeNotice = () => {
	// 	setTimeout(() => this.setState({showNotice: false}), 2000)
	// }
	private placeOrder = async () => {
		const { account, addOrder } = this.props;
		try {
			await addOrder(
				account,
				this.props.pair,
				Number(this.state.betPrice),
				Number(this.state.betNumber),
				true,
				CommonUtil.getExpiryTimestamp(false)
			);

			this.props.onCancel(this.props.isCall);
			this.setState({ betNumber: 0, betPrice: 0, showNotice: true });
			//this.closeNotice();
		} catch (error) {
			console.log(error);
		}
	};

	private onSliderChange = (value: number) => {
		const orderBookSnapshot = this.props.orderBookSnapshot;
		if (!orderBookSnapshot.asks) return;

		const denomination = this.props.token ? this.props.token.denomination : 0.1;
		let amt = 0;
		let price = 0;
		for (const orderBookLevel of orderBookSnapshot.asks) {
			amt += orderBookLevel.balance;
			price = orderBookLevel.price + this.props.markUp;
			if (amt >= value) {
				this.setState({
					betNumber: Math.floor(value / denomination) * denomination,
					betPrice: price
				});
				return;
			}
		}

		this.setState({
			betNumber: Math.floor(amt / denomination) * denomination,
			betPrice: price
		});
	};

	private onClose = () => {
		this.setState({
			betNumber: 0
		});
		this.props.onCancel(this.props.isCall);
	};

	public render() {
		const {
			isBetCardOpen,
			endTime,
			vivaldiIndex,
			isCall,
			onGameTypeChange,
			downdownPrice,
			downPrice,
			upPrice,
			upupPrice,
			ethBalance,
			orderBookSnapshot,
			titleN
		} = this.props;
		const { betNumber, betPrice, zeroRate, showNotice } = this.state;
		const min = 0;
		const max = betPrice ? ethBalance.weth / betPrice : Math.min(ethBalance.weth || 0, 10);
		const renderer = ({ hours, minutes, seconds, completed }: any) => {
			if (completed) return <span>Settling</span>;
			else
				return (
					<span>
						{util.fillZero(hours)}:{util.fillZero(minutes)}:{util.fillZero(seconds)}
					</span>
				);
		};
		return (
			<SVBetCard>
				<SNotice
					className={showNotice ? 'showDiv' : 'hideDiv'}
					onClick={() => this.setState({ showNotice: false })}
				>
					{titleN}
				</SNotice>
				<div
					className={
						(isBetCardOpen ? 'bet-card-open' : 'bet-card-close') + ' card-wrapper'
					}
				>
					<STagWrapper>
						{/* <div
							className={entryTag === 0 ? 'down-active' : 'down-inactive'}
							onClick={() => onTagChange(1, false)}
						>
							<img src={down2} style={{ marginTop: 4 }} />
						</div> */}
						<div
							className={
								!isCall && vivaldiIndex === 0 ? 'down-active' : 'down-inactive'
							}
							onClick={() => onGameTypeChange(0, false)}
						>
							<img src={down} style={{ marginTop: 4 }} />
						</div>
						<div
							className={isCall && vivaldiIndex === 0 ? 'up-active' : 'up-inactive'}
							onClick={() => onGameTypeChange(0, true)}
						>
							<img src={up} style={{ marginBottom: 4 }} />
						</div>
						{/* <div
							className={entryTag === 3 ? 'up-active' : 'up-inactive'}
							onClick={() => onTagChange(1, true)}
						>
							<img src={up2} style={{ marginBottom: 4 }} />
						</div> */}
					</STagWrapper>
					<SBetInfoWrapper>
						<h3>
							I think <b>ETH</b> is going
							{!isCall ? ' below' : ' above'}
						</h3>
						<div className={(!isCall ? 'below' : 'above') + ' price-wrapper'}>
							{this.getPrice(
								downdownPrice,
								downPrice,
								upPrice,
								upupPrice,
								vivaldiIndex,
								isCall
							)}
							<span> in</span>
						</div>
						<div className={(!isCall ? 'below' : 'above') + ' count-down'}>
							<Countdown date={endTime} renderer={renderer} />
						</div>
					</SBetInfoWrapper>

					{orderBookSnapshot && orderBookSnapshot.asks.length ? (
						<SSliderWrapper>
							<div className="des-wrapper">
								<div className="des-row">
									<div>Paying</div>
									<div>{util.formatBalance(betNumber * betPrice)}</div>
									<div>ETH</div>
								</div>
								<div className="des-row">
									<div>To Earn</div>
									<div>{util.formatBalance(betNumber)}</div>
									<div>ETH</div>
									<div>{`(+${util.formatPercent(
										betPrice ? 1 / betPrice - 1 : zeroRate
									)})`}</div>
								</div>
							</div>
							<div className="slider-wrapper">
								<Slider
									min={min}
									max={max}
									defaultValue={0}
									value={betNumber}
									step={0.1}
									onChange={this.onSliderChange}
									className={!isCall ? 'below' : 'above'}
								/>
							</div>
						</SSliderWrapper>
					) : (
						<SSliderWrapper>
							<div className="des-wrapper-ph">No markets</div>
						</SSliderWrapper>
					)}

					<SCardButtonWrapper>
						<div
							className={(!isCall ? 'belowC' : 'aboveC') + ' button'}
							onClick={this.onClose}
						>
							CANCEL
						</div>
						<div
							className={
								(!isCall ? 'below' : 'above') +
								' button' +
								(orderBookSnapshot && orderBookSnapshot.asks.length && betNumber
									? ''
									: ' button-disabled')
							}
							onClick={this.placeOrder}
						>
							BUY
							<img src={!isCall ? bear : bull} />
						</div>
					</SCardButtonWrapper>
				</div>
			</SVBetCard>
		);
	}
}
