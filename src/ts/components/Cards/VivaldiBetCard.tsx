import bear from 'images/vivaldi/bear.png';
import bull from 'images/vivaldi/bull.png';
import down2 from 'images/vivaldi/downdownW.png';
import down from 'images/vivaldi/downW.png';
import up2 from 'images/vivaldi/upupW.png';
import up from 'images/vivaldi/upW.png';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as React from 'react';
import Countdown from 'react-countdown-now';
import util from 'ts/common/util';
import {
	SBetInfoWrapper,
	SCardButtonWrapper,
	SSliderWrapper,
	STagWrapper,
	SVBetCard
} from './_styledV';

interface IProps {
	cardOpen: boolean;
	endTime: string;
	entryTag: number;
	downdownPrice: number;
	downPrice: number;
	upPrice: number;
	upupPrice: number;
	onBuy?: () => void;
	onCancel: (entry?: number) => void;
	onTagChange: (tag: number) => void;
}

interface IState {
	currentTag: number;
	betNumber: number;
}

export default class VivaldiBetCard extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			currentTag: props.entryTag,
			betNumber: 0
		};
	}

	private getPrice = (ddP: number, dP: number, uP: number, uuP: number, entryTag: number) => {
		switch (entryTag) {
			case 0:
				return '$' + util.formatPriceShort(ddP);
			case 1:
				return '$' + util.formatPriceShort(dP);
			case 2:
				return '$' + util.formatPriceShort(uP);
			default:
				return '$' + util.formatPriceShort(uuP);
		}
	};

	private onSliderChange = (value: number) => {
		this.setState({
			betNumber: value
		});
	};

	private onClose = () => {
		this.setState({
			betNumber: 0
		});
		this.props.onCancel();
	};

	public render() {
		const {
			cardOpen,
			endTime,
			entryTag,
			onTagChange,
			downdownPrice,
			downPrice,
			upPrice,
			upupPrice
		} = this.props;
		const { betNumber } = this.state;
		const min = 0;
		const max = 10;
		const ratio = 0.55;
		const renderer = ({ hours, minutes, seconds, completed }: any) => {
			if (completed) return <span>Result Settling</span>;
			else
				return (
					<span>
						{util.fillZero(hours)}:{util.fillZero(minutes)}:{util.fillZero(seconds)}
					</span>
				);
		};
		return (
			<SVBetCard>
				<div className={(cardOpen ? 'bet-card-open' : 'bet-card-close') + ' card-wrapper'}>
					<STagWrapper>
						<div
							className={entryTag === 0 ? 'down-active' : 'down-inactive'}
							onClick={() => onTagChange(0)}
						>
							<img src={down2} style={{ marginTop: 4 }} />
						</div>
						<div
							className={entryTag === 1 ? 'down-active' : 'down-inactive'}
							onClick={() => onTagChange(1)}
						>
							<img src={down} style={{ marginTop: 4 }} />
						</div>
						<div
							className={entryTag === 2 ? 'up-active' : 'up-inactive'}
							onClick={() => onTagChange(2)}
						>
							<img src={up} style={{ marginBottom: 4 }} />
						</div>
						<div
							className={entryTag === 3 ? 'up-active' : 'up-inactive'}
							onClick={() => onTagChange(3)}
						>
							<img src={up2} style={{ marginBottom: 4 }} />
						</div>
					</STagWrapper>
					<SBetInfoWrapper>
						<h3>
							I think <b>ETH</b> is going to{' '}
							{entryTag === 0 || entryTag === 1 ? 'below' : 'above'}
						</h3>
						<div
							className={
								(entryTag === 0 || entryTag === 1 ? 'below' : 'above') +
								' price-wrapper'
							}
						>
							{this.getPrice(downdownPrice, downPrice, upPrice, upupPrice, entryTag)}
							<span> in</span>
						</div>
						<div
							className={
								(entryTag === 0 || entryTag === 1 ? 'below' : 'above') +
								' count-down'
							}
						>
							<Countdown date={moment(endTime).valueOf()} renderer={renderer} />
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
								<div>{util.formatBalance(betNumber * (1 + ratio))}</div>
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
								step={0.1}
								onChange={this.onSliderChange}
								className={entryTag === 0 || entryTag === 1 ? 'below' : 'above'}
							/>
						</div>
					</SSliderWrapper>
					<SCardButtonWrapper>
						<div
							className={
								(entryTag === 0 || entryTag === 1 ? 'belowC' : 'aboveC') +
								' button'
							}
							onClick={this.onClose}
						>
							CANCEL
						</div>
						<div
							className={
								(entryTag === 0 || entryTag === 1 ? 'below' : 'above') + ' button'
							}
						>
							BUY
							<img src={entryTag === 0 || entryTag === 1 ? bear : bull} />
						</div>
					</SCardButtonWrapper>
				</div>
			</SVBetCard>
		);
	}
}
