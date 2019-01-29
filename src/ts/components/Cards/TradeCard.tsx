import { Radio, Spin } from 'antd';
import * as d3 from 'd3';
import close from 'images/icons/close.svg';
import link from 'images/icons/linkBlack.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { ColorStyles } from 'ts/common/styles';
import { ITrade } from 'ts/common/types';
import {
	IEthBalance,
	INotification,
	IOrderBookSnapshot,
	IToken,
	ITokenBalance
} from 'ts/common/types';
import util from 'ts/common/util';
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

interface IProps {
	account: string;
	token: string;
	tokenInfo?: IToken;
	tokenBalance?: ITokenBalance;
	ethBalance: IEthBalance;
	orderBook: IOrderBookSnapshot;
	ethPrice: number;
	navInEth: number;
	navUpdatedAt: number;
	interestOrLeverage: number;
	notify: (notification: INotification) => any;
	handleClose: () => void;
	setUnlimitedTokenAllowance: (code: string, account: string) => any;
	addOrder: (
		account: string,
		pair: string,
		price: number,
		amount: number,
		isBid: boolean,
		expiry: number
	) => Promise<string>;
	trades: { [pair: string]: ITrade[] };
}

interface IState {
	account: string;
	token: string;
	isBid: boolean;
	price: string;
	amount: string;
	expiry: number;
	approving: boolean;
	submitting: boolean;
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
const getExpiryDescription = (isMonth: boolean) => `Valid till ${util.formatExpiry(isMonth)}`;

const getLimit = (
	price: string,
	isBid: boolean,
	ethBalance: IEthBalance,
	tokenBalance?: ITokenBalance,
	tokenInfo?: IToken
) => {
	const priceNum = Number(price);
	if (!tokenInfo) return 0;
	const feeSchedule = tokenInfo.feeSchedules[CST.TH_WETH];

	if (!feeSchedule) return 0;

	const availableETH = Math.min(ethBalance.weth, ethBalance.allowance);
	const availableToken = tokenBalance
		? Math.min(tokenBalance.balance, tokenBalance.allowance)
		: 0;
	if (feeSchedule.asset)
		if (isBid) {
			const fee = Math.max(
				(availableETH / (1 + feeSchedule.rate)) * feeSchedule.rate,
				feeSchedule.minimum
			);
			return Math.max(0, (availableETH - fee) / priceNum);
		} else return availableToken;

	if (isBid) return availableETH / priceNum;
	else {
		const fee = Math.max(
			(availableToken / (1 + feeSchedule.rate)) * feeSchedule.rate,
			feeSchedule.minimum
		);
		return Math.max(0, availableToken - fee);
	}
};

export default class TradeCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		const price =
			props.tokenInfo && props.orderBook.asks && props.orderBook.asks.length
				? util.formatFixedNumber(
						props.orderBook.asks[0].price ? props.orderBook.asks[0].price : 0,
						props.tokenInfo.precisions[CST.TH_WETH]
				)
				: '';
		this.state = {
			account: props.account,
			token: props.token,
			isBid: true,
			price: price,
			amount: '',
			expiry: 1,
			approving: false,
			submitting: false,
			sliderValue: 0,
			priceDescription: getPriceDescription(price, props.ethPrice),
			tradeDescription: getTradeDescription(props.token, true, '', '', props.tokenInfo),
			feeDescription: getFeeDescription(props.token, '', '', props.tokenInfo),
			expiryDescription: getExpiryDescription(false)
		};
		document.addEventListener('keydown', this.handleKeyBoardEsc);
	}

	private handleKeyBoardEsc = (event: KeyboardEvent) => {
		if (event.keyCode === 27 && this.props.token) this.props.handleClose();
	};

	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.account !== prevState.account || nextProps.token !== prevState.token) {
			const price =
				nextProps.tokenInfo && nextProps.orderBook.asks && nextProps.orderBook.asks.length
					? util.formatFixedNumber(
							nextProps.orderBook.asks[0].price
								? nextProps.orderBook.asks[0].price
								: 0,
							nextProps.tokenInfo.precisions[CST.TH_WETH]
					)
					: '';

			return {
				account: nextProps.account,
				token: nextProps.token,
				isBid: true,
				price: price,
				amount: '',
				expiry: 1,
				approving: false,
				submitting: false,
				sliderValue: 0,
				priceDescription: getPriceDescription(price, nextProps.ethPrice),
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
		}

		// check for allowance
		if (
			prevState.approving &&
			((prevState.isBid && nextProps.ethBalance.allowance) ||
				(!prevState.isBid && nextProps.tokenBalance && nextProps.tokenBalance.allowance))
		)
			return { approving: false };

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
		const amount = step
			? util.formatFixedNumber(Math.max(0, (limit * Number(e)) / 100 - step), step)
			: limit * (Number(e) / 100) + '';
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
			const price = stepPrice
				? util.formatFixedNumber(Number(e), stepPrice)
				: this.state.price;
			this.setState({
				price: price,
				amount: '',
				sliderValue: 0,
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
		if (e.match(CST.RX_NUM_P) && Number(e)) {
			const step = tokenInfo ? tokenInfo.denomination : null;
			const amount = step
				? util.formatFixedNumber(Math.min(Number(e), Math.max(limit - step, 0)), step)
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

	private handleSideChange = (isBid: boolean) => {
		const { tokenInfo, orderBook, ethPrice, token } = this.props;
		const { expiry } = this.state;
		const precision = tokenInfo ? tokenInfo.precisions[CST.TH_WETH] : 0;
		const orders = (!isBid ? orderBook.bids : orderBook.asks).slice(0, 1);
		const price =
			orders && orders.length
				? util.formatFixedNumber(orders[0].price ? orders[0].price : 0, precision)
				: '';
		this.setState({
			isBid: isBid,
			amount: '',
			sliderValue: 0,
			price: price,
			priceDescription: getPriceDescription(price, ethPrice),
			tradeDescription: getTradeDescription(token, isBid, price, '', tokenInfo),
			feeDescription: getFeeDescription(token, price, '', tokenInfo),
			expiryDescription: getExpiryDescription(expiry === 2)
		});
	};

	private handlePriceInputChange = (value: string) => {
		this.setState({ price: value });
	};
	private handleApprove = async () => {
		const { token, account, notify } = this.props;
		this.setState({ approving: true });
		try {
			const { isBid } = this.state;
			const tx = await this.props.setUnlimitedTokenAllowance(
				isBid ? CST.TH_WETH : token,
				account
			);
			notify({
				level: 'info',
				title: `${token}`,
				message: 'Approval transaction sent',
				transactionHash: tx
			});
		} catch (error) {
			notify({
				level: 'error',
				title: `${token}`,
				message: '`Error in sending approval transaction',
				transactionHash: ''
			});
			this.setState({ approving: false });
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

	private handleSubmit = async () => {
		const { account, token, tokenInfo, ethPrice, notify, addOrder } = this.props;
		const { isBid, price, amount, expiry } = this.state;
		try {
			this.setState({ submitting: true });
			await addOrder(
				account,
				token + '|' + CST.TH_WETH,
				Number(price),
				Number(amount),
				isBid,
				util.getExpiryTimestamp(expiry === 2)
			);
			this.setState({
				price: '',
				amount: '',
				expiry: 1,
				priceDescription: getPriceDescription('', ethPrice),
				tradeDescription: getTradeDescription(token, true, '', '', tokenInfo),
				feeDescription: getFeeDescription(token, '', '', tokenInfo),
				expiryDescription: getExpiryDescription(false),
				submitting: false
			});
		} catch (error) {
			notify({
				level: 'error',
				title: `${token}-${CST.TH_WETH}`,
				message: 'Error in signing order',
				transactionHash: ''
			});
			this.setState({ submitting: false });
		}
	};

	private cardDescription = (props: { token: any; n: number }) => {
		let des: JSX.Element;
		switch (props.token) {
			case 'aETH':
				des = (
					<span>
						Price-stable
						<span className="aspan" style={{ fontSize: 12 }}>
							INCOME
						</span>
						{`token with ${d3.format('.2%')(props.n)} p.a. coupon.`}
					</span>
				);
				break;
			case 'bETH':
				des = (
					<span>
						ETH-backed
						<span className="aspan" style={{ fontSize: 12 }}>
							LEVERAGE
						</span>
						{`token with ${d3.format('.2f')(props.n)}x leverage.`}
					</span>
				);
				break;
			case 'sETH':
				des = (
					<span>
						ETH-backed
						<span className="aspan" style={{ fontSize: 12 }}>
							SHORT
						</span>
						{`token with ${d3.format('.2f')(props.n)}x leverage.`}
					</span>
				);
				break;
			default:
				des = (
					<span>
						ETH-backed
						<span className="aspan" style={{ fontSize: 12 }}>
							LONG
						</span>
						{`token with ${d3.format('.2f')(props.n)}x leverage.`}
					</span>
				);
				break;
		}
		return des;
	};

	public render() {
		const {
			token,
			tokenInfo,
			handleClose,
			tokenBalance,
			ethBalance,
			orderBook,
			interestOrLeverage,
			navInEth,
			navUpdatedAt,
			trades
		} = this.props;
		const {
			isBid,
			price,
			amount,
			expiry,
			approving,
			submitting,
			sliderValue,
			priceDescription,
			tradeDescription,
			feeDescription,
			expiryDescription
		} = this.state;
		const pair = orderBook.pair;
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
		const limit = getLimit(price, isBid, ethBalance, tokenBalance, tokenInfo);
		const precision = tokenInfo ? tokenInfo.precisions[CST.TH_WETH] : 0;
		const denomination = tokenInfo ? tokenInfo.denomination : 0;
		return (
			<div style={{ display: !!token ? 'block' : 'none' }}>
				<div className={'popup-bg ' + (!!token ? 'popup-open-bg' : '')} />
				<SCard
					title={
						<SCardTitle>{CST.TH_TRADE + ' ' + token + '/' + CST.TH_WETH}</SCardTitle>
					}
					width="360px"
					className={'popup-card ' + (!!token ? 'popup-open' : '')}
					noBodymargin
					extra={
						<SDivFlexCenter horizontal width="20px">
							<img className="cardpopup-close" src={close} onClick={handleClose} />
						</SDivFlexCenter>
					}
				>
					<div className="convert-popup-des">
						<this.cardDescription token={token.split('-')[0]} n={interestOrLeverage} />
						<div className="trade-nav">
							<span className="navspan">NAV</span>
							<span className="trade-nav-px">
								{`${util.formatFixedNumber(navInEth, precision)} ETH`}
							</span>
							<span style={{ fontSize: 10, color: ColorStyles.TextBlackAlphaL }}>
								{`Last updated: ${util.convertUpdateTime(navUpdatedAt)}`}
							</span>
						</div>
					</div>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li
									className="block-title"
									style={{ padding: '5px 5px', justifyContent: 'center' }}
								>
									{CST.TH_ORDERBOOK}
								</li>
							</ul>
						</div>
					</SCardList>
					<SDivFlexCenter horizontal>
						<SCardList>
							<div className="status-list-wrapper noMargin">
								<ul style={{ margin: 0 }}>
									{bidsToRender.map((item, i) => (
										<li
											key={i}
											style={{
												padding: '5px 5px 5px 30px'
											}}
										>
											<span className="content">
												{item.balance && item.balance > 0
													? util.formatFixedNumber(
															item.balance,
															denomination
													)
													: '-'}
											</span>
											<span className="title bid-span">
												<b>
													{item.price && item.price > 0
														? util.formatFixedNumber(
																item.price,
																precision
														)
														: '-'}
												</b>
											</span>
										</li>
									))}
								</ul>
							</div>
						</SCardList>
						<SCardList>
							<div className="status-list-wrapper">
								<ul style={{ margin: 0 }}>
									{asksToRender.map((item, i) => (
										<li
											key={i}
											style={{
												padding: '5px 30px 5px 5px'
											}}
										>
											<span className="title ask-span">
												<b>
													{item.price && item.price > 0
														? util.formatFixedNumber(
																item.price,
																precision
														)
														: '-'}
												</b>
											</span>
											<span className="content">
												{item.balance && item.balance > 0
													? util.formatFixedNumber(
															item.balance,
															denomination
													)
													: '-'}
											</span>
										</li>
									))}
								</ul>
							</div>
						</SCardList>
					</SDivFlexCenter>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li
									className="block-title"
									style={{ padding: '5px 15px', justifyContent: 'center' }}
								>
									{CST.TH_MARKET_TRADES}
								</li>
							</ul>
						</div>
					</SCardList>
					<SDivFlexCenter horizontal>
						<SCardList>
							<div
								className="status-list-wrapper"
								style={{ border: 'none', fontSize: 12 }}
							>
								<ul style={{ margin: 0 }}>
									{trades && trades[pair] && trades[pair].length ? (
										trades[pair]
											.slice(
												0,
												trades[pair].length > 3 ? 3 : trades[pair].length
											)
											.map((item, i) => (
												<li
													key={i}
													style={{
														padding: '3px 5px 3px 30px'
													}}
												>
													<span
														className="content"
														style={{ width: '30%' }}
													>
														{item.timestamp && item.timestamp > 0
															? util.formatTime(item.timestamp)
															: 'No Trades'}
													</span>
													<span
														className={
															item.taker.side === 'bid'
																? 'title bid-span'
																: 'title ask-span'
														}
														style={{
															width: '30%',
															textAlign: 'right'
														}}
													>
														<b>
															{item.maker.price &&
															item.maker.price > 0
																? util.formatFixedNumber(
																		item.maker.price,
																		precision
																)
																: '-'}
														</b>
													</span>
													<span
														className="content antdColumnAlignRight"
														style={{ width: '25%' }}
													>
														{item.maker.amount && item.maker.amount > 0
															? util.formatFixedNumber(
																	item.maker.amount,
																	denomination
															)
															: '-'}
													</span>
													<span
														className="title bid-span"
														style={{
															paddingRight: 26,
															width: '15%'
														}}
													>
														<img
															className="cus-link"
															src={link}
															style={{
																width: '12px',
																height: '12px',
																marginLeft: '10px'
															}}
															onClick={() =>
																window.open(
																	util.getEtherScanTransactionLink(
																		item.transactionHash
																	)
																)
															}
														/>
													</span>
												</li>
											))
									) : (
										<li
											style={{
												margin: 'auto',
												width: 110
											}}
										>
											No Recent Trades
										</li>
									)}
								</ul>
							</div>
						</SCardList>
					</SDivFlexCenter>
					<Spin
						spinning={approving || submitting}
						tip={
							(approving ? 'Pending Approval' : 'Pending Order Signature') +
							'. Please check your MetaMask!'
						}
					>
						<SCardConversionForm>
							<SDivFlexCenter horizontal width="100%" padding="10px;">
								<button
									className={
										isBid ? 'conv-button selected' : 'conv-button non-select'
									}
									onClick={() => this.handleSideChange(true)}
								>
									{CST.TH_BUY.toUpperCase()}
								</button>
								<button
									className={
										!isBid ? 'conv-button selected' : 'conv-button non-select'
									}
									onClick={() => this.handleSideChange(false)}
								>
									{CST.TH_SELL.toUpperCase()}
								</button>
							</SDivFlexCenter>
							<SCardList noMargin width="100%">
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 15px' }}>
											<div
												className="tabletitle"
												style={{ textAlign: 'left', width: '20%' }}
											>
												Token
											</div>
											<div className="tabletitle">{token}</div>
											<div className="tabletitle">{CST.TH_WETH}</div>
										</li>
										<li style={{ padding: '5px 15px' }}>
											<div
												className="tabletitle"
												style={{ textAlign: 'left', width: '20%' }}
											>
												Balance
											</div>
											<div className="tablecontent">
												{tokenBalance
													? util.formatBalance(tokenBalance.balance)
													: 0}
											</div>
											<div className="tablecontent">
												{util.formatBalance(ethBalance.weth)}
											</div>
										</li>
									</ul>
								</div>
							</SCardList>
							{approveRequired && !approving ? (
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
											style={{ padding: '0 10px', marginBottom: 0 }}
										>
											<span className="input-des">{CST.TH_PX}</span>
											<SInput
												right
												width="100%"
												value={price}
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
											<span className="input-des">{CST.TH_AMOUNT}</span>
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
												disabled={price === '' || !limit}
												value={limit ? sliderValue : 0}
												marks={marks}
												step={1}
												onChange={(e: any) =>
													this.handleSliderChange(e, limit)
												}
											/>
										</li>
										<li className="input-line" style={{ padding: '0 15px' }}>
											<span className="title" style={{ width: 40 }}>
												{CST.TH_EXPIRY}
											</span>
											<SDivFlexCenter horizontal width="46%" rowInv>
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
											<div className="convert-radio-des">
												{expiryDescription}
											</div>
										</li>
									</ul>
								</div>
							</SCardList>
						</SCardConversionForm>
						<div className="convert-popup-des">{tradeDescription}</div>
						<div className="convert-popup-des">{feeDescription}</div>
						<SDivFlexCenter horizontal width="100%" padding="10px">
							<SButton onClick={this.handleReset} width="49%">
								{CST.TH_RESET}
							</SButton>
							<SButton
								disable={Number(price) === 0 || Number(amount) === 0}
								style={{
									opacity: Number(price) === 0 || Number(amount) === 0 ? 0.3 : 1
								}}
								onClick={this.handleSubmit}
								width="49%"
							>
								{isBid ? CST.TH_BUY : CST.TH_SELL}
							</SButton>
						</SDivFlexCenter>
					</Spin>
				</SCard>
			</div>
		);
	}
}
