import { notification, Radio, Spin } from 'antd';
import * as d3 from 'd3';
import close from 'images/icons/close.svg';
import help from 'images/icons/help.svg';
import moment from 'moment';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IEthBalance, IOrderBookSnapshot, IToken, ITokenBalance } from 'ts/common/types';
import util from 'ts/common/util';
import web3Util from '../../common/web3Util';
import { SDivFlexCenter } from '../_styled';
import {
	SButton,
	SCard,
	SCardConversionForm,
	SCardList,
	SCardTitle,
	SInput,
	SSlider
} from './_styled';
const RadioGroup = Radio.Group;
const openNotification = (tx: string) => {
	const btn = (
		<SButton
			onClick={() =>
				window.open(`https://${__KOVAN__ ? 'kovan.' : ''}etherscan.io/tx/${tx}`, '_blank')
			}
		>
			View Transaction on Etherscan
		</SButton>
	);
	const args = {
		message: 'Transaction Sent',
		description: 'Transaction hash: ' + tx,
		duration: 0,
		btn
	};
	notification.open(args);
};

interface IProps {
	token: string;
	tokenInfo?: IToken;
	tokenBalance?: ITokenBalance;
	ethBalance: IEthBalance;
	orderBook: IOrderBookSnapshot;
	ethPrice: number;
	handleClose: () => void;
}

interface IState {
	token: string;
	isBid: boolean;
	price: string;
	amount: string;
	expiry: number;
	loading: boolean;
	sliderValue: number;
	priceDescription: string;
	tradeDescription: string;
	feeDescription: string;
	expiryDescription: string;
}

const marks = {
	0: {
		label: <strong>0%</strong>
	},
	25: {
		label: <strong>25%</strong>
	},
	50: {
		label: <strong>50%</strong>
	},
	75: {
		label: <strong>75%</strong>
	},
	100: {
		label: <strong>100%</strong>
	}
};

const getPriceDescription = (price: string, ethPrice: number) => {
	const priceNum = Number(price);
	if (price && priceNum) return `approx. ${util.formatNumber(priceNum * ethPrice)} USD`;

	return 'estimated USD price';
};

const getTradeDescription = (
	token: string,
	isBid: boolean,
	price: string,
	amount: string,
	tokenInfo?: IToken
) => {
	const amountNum = Number(amount);
	const priceNum = Number(price);
	if (!tokenInfo || !amount || !price || !priceNum || !amountNum)
		return isBid ? `Buy ${token} with WETH` : `Sell ${token} for WETH`;
	return isBid
		? `Buy ${amount} ${token} with ${util.formatBalance(amountNum * priceNum)} WETH`
		: `Sell ${amount} ${token} for ${util.formatBalance(amountNum * priceNum)} WETH`;
};

const getFeeDescription = (token: string, price: string, amount: string, tokenInfo?: IToken) => {
	const amountNum = Number(amount);
	const priceNum = Number(price);
	const feeSchedule = tokenInfo ? tokenInfo.feeSchedules[CST.TH_WETH] : null;
	const fee = feeSchedule
		? Math.max(
				amountNum * feeSchedule.rate * (feeSchedule.asset ? priceNum : 1),
				feeSchedule.minimum
		)
		: 0;
	return `Pay ${fee} ${feeSchedule && feeSchedule.asset ? feeSchedule.asset : token} fee`;
};
const getExpiryDescription = (isMonth: boolean) =>
	`Order Valid till ${moment(util.getExpiryTimestamp(isMonth)).format('YYYY-MM-DD HH:mm')}`;

export default class TradeCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			token: props.token,
			isBid: true,
			price: '',
			amount: '',
			expiry: 1,
			loading: false,
			sliderValue: 0,
			priceDescription: getPriceDescription('', props.ethPrice),
			tradeDescription: getTradeDescription(props.token, true, '', '', props.tokenInfo),
			feeDescription: getFeeDescription(props.token, '', '', props.tokenInfo),
			expiryDescription: getExpiryDescription(false)
		};
	}

	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.token !== prevState.token)
			return {
				token: nextProps.token,
				isBid: true,
				price: '',
				amount: '',
				expiry: 1,
				loading: false,
				sliderValue: 0,
				priceDescription: getPriceDescription('', nextProps.ethPrice),
				tradeDescription: getTradeDescription(
					nextProps.token,
					true,
					'',
					'',
					nextProps.tokenInfo
				),
				feeDescription: getFeeDescription(nextProps.token, '', '', nextProps.tokenInfo),
				expiryDescription: getExpiryDescription(false)
			};

		// check for allowance
		if (
			prevState.loading &&
			((prevState.isBid && nextProps.ethBalance.allowance) ||
				(!prevState.isBid && nextProps.tokenBalance && nextProps.tokenBalance.allowance))
		)
			return {
				loading: false
			};

		return null;
	}

	private handleExpiryChange = (e: number) =>
		this.setState({
			expiry: e,
			expiryDescription: getExpiryDescription(e === 2)
		});

	private handleSliderChange(e: string, limit: number) {
		const { tokenInfo, token } = this.props;
		const { isBid, price, expiry } = this.state;
		const step = tokenInfo ? tokenInfo.denomination : null;
		const decimal = step && step < 1 ? (step + '').length - 2 : 0;
		const amount = step
			? (Math.floor((limit * Number(e)) / 100 / step) * step).toFixed(decimal)
			: (limit * (Number(e) / 100)).toFixed(decimal);
		this.setState({
			amount: amount,
			sliderValue: Number(e),
			tradeDescription: getTradeDescription(token, isBid, price, amount, tokenInfo),
			feeDescription: getFeeDescription(token, price, amount, tokenInfo),
			expiryDescription: getExpiryDescription(expiry === 2)
		});
	}

	private handlePriceBlurInputChange(e: string) {
		const { tokenInfo, ethPrice, token } = this.props;
		const { isBid, amount, expiry } = this.state;

		if (e.match(CST.RX_NUM_P)) {
			const stepPrice = tokenInfo ? tokenInfo.precisions[CST.TH_WETH] : null;
			const decimal = stepPrice && stepPrice < 1 ? (stepPrice + '').length - 2 : 0;
			const price = stepPrice
				? (Math.round(Number(e) / stepPrice) * stepPrice).toFixed(decimal)
				: this.state.price;
			this.setState({
				price: price,
				priceDescription: getPriceDescription(price, ethPrice),
				tradeDescription: getTradeDescription(token, isBid, price, amount, tokenInfo),
				feeDescription: getFeeDescription(token, price, amount, tokenInfo),
				expiryDescription: getExpiryDescription(expiry === 2)
			});
		} else
			this.setState({
				price: '',
				amount: '',
				sliderValue: 0,
				priceDescription: getPriceDescription('', ethPrice),
				tradeDescription: getTradeDescription(token, isBid, '', '', tokenInfo),
				feeDescription: getFeeDescription(token, '', '', tokenInfo),
				expiryDescription: getExpiryDescription(expiry === 2)
			});
	}

	private handleAmountBlurChange(e: string, limit: number) {
		const { tokenInfo, token } = this.props;
		const { isBid, price, expiry } = this.state;
		if (e.match(CST.RX_NUM_P)) {
			const step = tokenInfo ? tokenInfo.denomination : null;
			const decimal = step && step < 1 ? (step + '').length - 2 : 0;
			const amount = step
				? (Math.floor(Math.round(Math.min(Number(e), limit) / step)) * step).toFixed(
						decimal
				)
				: this.state.amount;
			this.setState({
				amount: amount,
				sliderValue: (Number(e) / limit) * 100,
				tradeDescription: getTradeDescription(token, isBid, price, amount, tokenInfo),
				feeDescription: getFeeDescription(token, price, amount, tokenInfo),
				expiryDescription: getExpiryDescription(expiry === 2)
			});
		} else
			this.setState({
				amount: '',
				sliderValue: 0,
				tradeDescription: getTradeDescription(token, isBid, price, '', tokenInfo),
				feeDescription: getFeeDescription(token, price, '', tokenInfo),
				expiryDescription: getExpiryDescription(expiry === 2)
			});
	}

	private handleSideChange = () => {
		const { tokenInfo, ethPrice, token } = this.props;
		const { isBid, price, expiry } = this.state;
		this.setState({
			isBid: !isBid,
			amount: '',
			sliderValue: 0,
			priceDescription: getPriceDescription(price, ethPrice),
			tradeDescription: getTradeDescription(token, !isBid, price, '', tokenInfo),
			feeDescription: getFeeDescription(token, price, '', tokenInfo),
			expiryDescription: getExpiryDescription(expiry === 2)
		});
	};

	private handlePriceInputChange = (value: string) =>
		this.setState({
			price: value
		});

	private handleApprove = async () => {
		this.setState({ loading: true });
		try {
			const { isBid } = this.state;
			const tx = await web3Util.setUnlimitedTokenAllowance(
				isBid ? CST.TH_WETH : this.props.token
			);
			openNotification(tx);
		} catch (error) {
			this.setState({ loading: false });
		}
	};

	private handleAmountInputChange = (value: string) =>
		this.setState({
			amount: value
		});

	private handleReset = () =>
		this.setState({
			isBid: true,
			price: '',
			amount: '',
			expiry: 1,
			sliderValue: 0,
			priceDescription: getPriceDescription('', this.props.ethPrice),
			tradeDescription: getTradeDescription(
				this.props.token,
				true,
				'',
				'',
				this.props.tokenInfo
			),
			feeDescription: getFeeDescription(this.props.token, '', '', this.props.tokenInfo),
			expiryDescription: getExpiryDescription(false)
		});

	public render() {
		const { token, tokenInfo, handleClose, tokenBalance, ethBalance, orderBook } = this.props;
		const {
			isBid,
			price,
			amount,
			expiry,
			loading,
			sliderValue,
			priceDescription,
			tradeDescription,
			feeDescription,
			expiryDescription
		} = this.state;
		const bidsToRender = orderBook.bids.slice(0, 3);
		while (bidsToRender.length < 3)
			bidsToRender.push({
				balance: 0,
				count: 0,
				price: 0
			});
		const asksToRender = orderBook.asks.slice(0, 3);
		while (asksToRender.length < 3)
			asksToRender.push({
				balance: 0,
				count: 0,
				price: 0
			});
		const approveRequired = isBid
			? !ethBalance.allowance
			: tokenBalance && !tokenBalance.allowance;
		const limit = price
			? isBid
				? ethBalance.weth / Number(price)
				: tokenBalance
				? tokenBalance.balance
				: 0
			: 0;
		return (
			<div style={{ display: !!token ? 'block' : 'none' }}>
				<div className="popup-bg" />
				<SCard
					title={
						<SCardTitle>
							{CST.TH_TRADE.toUpperCase() + ' ' + token + '/' + CST.TH_WETH}
						</SCardTitle>
					}
					width="360px"
					className="popup-card"
					noBodymargin
					extra={
						<SDivFlexCenter horizontal width="40px">
							<img className="cardpopup-close" src={help} />
							<img className="cardpopup-close" src={close} onClick={handleClose} />
						</SDivFlexCenter>
					}
				>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li className="block-title" style={{ padding: '5px 15px' }}>
									{CST.TH_BALANCE}
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{token}</span>
									<span className="content">
										{tokenBalance
											? util.formatBalance(tokenBalance.balance)
											: 0}
									</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{CST.TH_WETH}</span>
									<span className="content">
										{util.formatBalance(ethBalance.weth)}
									</span>
								</li>
							</ul>
						</div>
					</SCardList>
					<SDivFlexCenter horizontal>
						<SCardList>
							<div className="status-list-wrapper">
								<ul style={{ opacity: isBid ? 1 : 0.5 }}>
									<li style={{ justifyContent: 'center' }}>{CST.TH_BID}</li>
									{bidsToRender.map((item, i) => (
										<li key={i} style={{ padding: '5px 5px 5px 15px' }}>
											<span className="content">
												{item.balance
													? d3.format(',.2f')(item.balance)
													: '-'}
											</span>
											<span className="title">
												{item.price ? d3.format(',.2f')(item.price) : '-'}
											</span>
										</li>
									))}
								</ul>
							</div>
						</SCardList>
						<SCardList>
							<div className="status-list-wrapper">
								<ul style={{ marginLeft: -1, opacity: isBid ? 0.5 : 1 }}>
									<li style={{ justifyContent: 'center' }}>{CST.TH_ASK}</li>
									{asksToRender.map((item, i) => (
										<li key={i} style={{ padding: '5px 15px 5px 5px' }}>
											<span className="title">
												{item.price ? d3.format(',.2f')(item.price) : '-'}
											</span>
											<span className="content">
												{item.balance
													? d3.format(',.2f')(item.balance)
													: '-'}
											</span>
										</li>
									))}
								</ul>
							</div>
						</SCardList>
					</SDivFlexCenter>
					<Spin spinning={loading} tip="loading...">
						<SCardConversionForm>
							<SDivFlexCenter horizontal width="100%" padding="10px;">
								{[CST.TH_BUY, CST.TH_SELL].map(side => (
									<button
										key={side}
										className={
											(isBid && side === CST.TH_BUY) ||
											(!isBid && side === CST.TH_SELL)
												? 'conv-button selected'
												: 'conv-button non-select'
										}
										onClick={() => this.handleSideChange()}
									>
										{side.toUpperCase()}
									</button>
								))}
							</SDivFlexCenter>
							{approveRequired && !loading ? (
								<div className="pop-up-new">
									<li>
										<p style={{ paddingTop: '100px', textAlign: 'center' }}>
											Not enough allowance, please approve first
										</p>
									</li>
									<li style={{ padding: '10px 100px 5px 100px' }}>
										<SButton onClick={this.handleApprove}>
											{CST.TH_APPROVE}
										</SButton>
									</li>
								</div>
							) : null}
							<SCardList noUlBorder noLiBorder>
								<div className="status-list-wrapper">
									<ul>
										<li
											className={'input-line'}
											style={{
												padding: '0 10px',
												marginBottom: 0
											}}
										>
											<span className="input-des">Price</span>
											<SInput
												right
												width="100%"
												value={this.state.price}
												type="number"
												min={0}
												step={
													tokenInfo
														? tokenInfo.precisions[CST.TH_WETH]
														: undefined
												}
												onChange={e =>
													this.handlePriceInputChange(e.target.value)
												}
												onBlur={e =>
													this.handlePriceBlurInputChange(e.target.value)
												}
											/>
										</li>
										<li
											className={'input-line'}
											style={{
												padding: '5px 15px',
												flexDirection: 'row-reverse'
											}}
										>
											<span className="des">{priceDescription}</span>
										</li>
										<li
											className={'input-line'}
											style={{ padding: '0 10px', marginBottom: 0 }}
										>
											<span className="input-des">Amount</span>
											<SInput
												right
												disabled={price === ''}
												width="100%"
												min={0}
												value={amount}
												type="number"
												step={
													tokenInfo ? tokenInfo.denomination : undefined
												}
												onChange={e =>
													this.handleAmountInputChange(e.target.value)
												}
												onBlur={e =>
													this.handleAmountBlurChange(
														e.target.value,
														limit
													)
												}
											/>
										</li>
										<li
											className={'input-line'}
											style={{ padding: '0px 15px' }}
										>
											<SSlider
												disabled={price === '' || limit < 0.1}
												value={sliderValue}
												marks={marks}
												step={1}
												defaultValue={0}
												onChange={(e: any) => this.handleSliderChange(e, limit)
												}
											/>
										</li>
										<li className="input-line" style={{ padding: '0 15px' }}>
											<span className="title" style={{ width: 200 }}>
												{CST.TH_EXPIRY}
											</span>
											<SDivFlexCenter horizontal width="60%" rowInv>
												<RadioGroup
													onChange={e =>
														this.handleExpiryChange(e.target.value)
													}
													value={expiry}
												>
													<Radio value={1}>Day</Radio>
													<Radio value={2}>Month</Radio>
												</RadioGroup>
											</SDivFlexCenter>
										</li>
									</ul>
								</div>
							</SCardList>
						</SCardConversionForm>
						<div className="convert-popup-des">{tradeDescription}</div>
						<div className="convert-popup-des">{feeDescription}</div>
						<div className="convert-popup-des">{expiryDescription}</div>
						<SDivFlexCenter horizontal width="100%" padding="10px">
							<SButton onClick={this.handleReset} width="49%">
								{CST.TH_RESET}
							</SButton>
							<SButton width="49%">{CST.TH_SUBMIT}</SButton>
						</SDivFlexCenter>
					</Spin>
				</SCard>
			</div>
		);
	}
}
