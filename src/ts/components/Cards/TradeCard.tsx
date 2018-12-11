//import waring from 'images/icons/waring.svg';
import { Radio } from 'antd';
import * as d3 from 'd3';
import close from 'images/icons/close.svg';
import help from 'images/icons/help.svg';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IEthBalance, IToken, ITokenBalance } from 'ts/common/types';
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
	token: string;
	tokenInfo?: IToken;
	tokenBalance?: ITokenBalance;
	ethBalance: IEthBalance;
	handleClose: () => void;
}

interface IState {
	token: string;
	isBid: boolean;
	price: string;
	amount: string;
	expiry: number;
}

export default class TradeCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isBid: true,
			price: '',
			amount: '',
			token: props.token,
			expiry: 1
		};
	}

	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.token !== prevState.token)
			return {
				isBid: true,
				price: '',
				amount: '',
				expiry: 1,
				token: nextProps.token
			};

		return null;
	}

	private onexpiryChange = (e: number) => {
		this.setState({
			expiry: e
		});
	};

	private handleSideChange = () =>
		this.setState({
			isBid: !this.state.isBid
		});
	private handlePriceInputChange = (value: string) =>
		this.setState({
			price: value
		});
	private handleAmountInputChange = (value: string) =>
		this.setState({
			amount: value
		});
	public render() {
		const { token, handleClose, tokenBalance, ethBalance } = this.props;
		const { isBid, price, amount, expiry } = this.state;
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
		const orderbooks = [
			{ price: 100, amount: 1234 },
			{ price: 100, amount: 1234 },
			{ price: 100, amount: 1234 },
			{ price: 100, amount: 1234 },
			{ price: 100, amount: 1234 }
		];
		return (
			<div style={{ display: !!token ? 'block' : 'none' }}>
				<div className="popup-bg" onClick={handleClose} />
				<SCard
					title={
						<SCardTitle>
							{CST.TH_TRADE.toUpperCase() + ' ' + token + '/' + CST.TH_WETH}
						</SCardTitle>
					}
					width="400px"
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
									<li style={{ justifyContent: 'center' }}>Bid</li>
									{orderbooks.map((item, i) => (
										<li key={i} style={{ padding: '5px 5px 5px 15px' }}>
											<span className="content">
												{d3.format(',.2f')(item.amount)}
											</span>
											<span className="title">
												{d3.format(',.2f')(item.price)}
											</span>
										</li>
									))}
								</ul>
							</div>
						</SCardList>
						<SCardList>
							<div className="status-list-wrapper">
								<ul style={{ marginLeft: -1, opacity: isBid ? 0.5 : 1 }}>
									<li style={{ justifyContent: 'center' }}>Ask</li>
									{orderbooks.map((item, i) => (
										<li key={i} style={{ padding: '5px 15px 5px 5px' }}>
											<span className="title">
												{d3.format(',.2f')(item.price)}
											</span>
											<span className="content">
												{d3.format(',.2f')(item.amount)}
											</span>
										</li>
									))}
								</ul>
							</div>
						</SCardList>
					</SDivFlexCenter>
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
										<SInput
											width="100%"
											placeholder="Price"
											value={price}
											onChange={e =>
												this.handlePriceInputChange(e.target.value)
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
										<span className="des">
											Description Description Description $ 1,000 USD{' '}
										</span>
									</li>
									<li
										className={'input-line'}
										style={{ padding: '0 10px', marginBottom: 0 }}
									>
										<SInput
											width="100%"
											placeholder="Amount"
											value={amount}
											onChange={e =>
												this.handleAmountInputChange(e.target.value)
											}
										/>
									</li>
									<li className={'input-line'} style={{ padding: '0 15px' }}>
										<SSlider marks={marks} step={10} defaultValue={0} />
									</li>
									<li className="input-line" style={{ padding: '0 15px' }}>
										<span className="title" style={{ width: 200 }}>
											{CST.TH_EXPIRY}
										</span>
										<SDivFlexCenter horizontal width="60%" rowInv>
											<RadioGroup
												onChange={e => this.onexpiryChange(e.target.value)}
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
					<div className="convert-popup-des">
						Description Description Description $ 1,000 USD,Description sdadd
						Description $ 1,000 USD Description Description asd adads $ 1,000 US asdad
						adasd a asd.
					</div>
					<SDivFlexCenter horizontal width="100%" padding="10px">
						<SButton
							onClick={() => this.setState({ price: '', amount: '', expiry: 1 })}
							width="49%"
						>
							RESET
						</SButton>
						<SButton width="49%">SUBMIT</SButton>
					</SDivFlexCenter>
				</SCard>
			</div>
		);
	}
}
