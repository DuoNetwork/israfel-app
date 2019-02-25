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
//import down2 from 'images/vivaldi/downdownW.png';
// import * as CST from 'ts/common/constants';
import { IEthBalance } from 'ts/common/types';
import util from 'ts/common/util';
import {
	SBetInfoWrapper,
	SCardButtonWrapper,
	SSliderWrapper,
	STagWrapper,
	SVBetCard
} from './_styledV';
//import { IVivaldiCustodianInfo } from 'ts/common/types';

interface IProps {
	pair: string;
	vivaldiIndex: number;
	isCall: boolean;
	account: string;
	tokens: IToken[];
	ethBalance: IEthBalance;
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	isBetCardOpen: boolean;
	endTime: number;
	downdownPrice: number;
	downPrice: number;
	upPrice: number;
	upupPrice: number;
	onBuy?: () => void;
	onCancel: (entry?: number) => void;
	onTagChange: (vivaldiIndex: number, isCall: boolean) => void;
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
	toEarn: number;
}

export default class VivaldiBetCard extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			betNumber: 0,
			betPrice: 0,
			toEarn: 0
		};
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
		} catch (error) {
			console.log(error);
		}
	};

	private onSliderChange = (value: number) => {
		const orderBookSnapshot = this.getOrderBookSnapshot() as IOrderBookSnapshot;
		if (!orderBookSnapshot.asks) return;

		let amt = 0;
		let price = 0;
		for (const orderBookLevel of orderBookSnapshot.asks) {
			amt += orderBookLevel.balance;
			price = orderBookLevel.price + 0.01;
			if (amt >= value) {
				this.setState({
					betNumber: value,
					betPrice: price,
					toEarn: value / price
				});
				return;
			}
		}

		this.setState({
			betNumber: amt,
			betPrice: price,
			toEarn: amt / price
		});
	};

	private onClose = () => {
		this.setState({
			betNumber: 0
		});
		this.props.onCancel();
	};

	private getOrderBookSnapshot = () => {
		return this.props.orderBooks ? this.props.orderBooks[this.props.pair] : {};
	};

	public render() {
		const {
			isBetCardOpen,
			endTime,
			vivaldiIndex,
			isCall,
			onTagChange,
			downdownPrice,
			downPrice,
			upPrice,
			upupPrice,
			ethBalance
		} = this.props;
		const { betNumber, toEarn } = this.state;
		const step = ethBalance ? Math.max(ethBalance.weth / 20, 0.2) : 0.2;
		const min = 0;
		const max = Math.min(ethBalance.weth || 0, 10);
		const ratio = betNumber ? (toEarn - betNumber) / betNumber : 0;
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
							onClick={() => onTagChange(0, false)}
						>
							<img src={down} style={{ marginTop: 4 }} />
						</div>
						<div
							className={isCall && vivaldiIndex === 0 ? 'up-active' : 'up-inactive'}
							onClick={() => onTagChange(0, true)}
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
							I think <b>ETH</b> is going to
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
					<SSliderWrapper>
						<div className="des-wrapper">
							<div className="des-row">
								<div>Paying</div>
								<div>{util.formatBalance(betNumber)}</div>
								<div>ETH</div>
							</div>
							<div className="des-row">
								<div>To Earn</div>
								<div>{util.formatBalance(toEarn)}</div>
								<div>ETH</div>
								<div>{`(+${util.formatPercent(ratio)})`}</div>
							</div>
						</div>
						<div className="slider-wrapper">
							<Slider
								min={min}
								max={max}
								defaultValue={0}
								value={betNumber}
								step={step}
								onChange={this.onSliderChange}
								className={!isCall ? 'below' : 'above'}
							/>
						</div>
					</SSliderWrapper>
					<SCardButtonWrapper>
						<div
							className={(!isCall ? 'belowC' : 'aboveC') + ' button'}
							onClick={this.onClose}
						>
							CANCEL
						</div>
						<div
							className={(!isCall ? 'below' : 'above') + ' button'}
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
