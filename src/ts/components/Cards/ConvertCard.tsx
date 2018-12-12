import close from 'images/icons/close.svg';
import help from 'images/icons/help.svg';
import waring from 'images/icons/waring.svg';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { duoWeb3Wrapper, getDualClassWrapper } from 'ts/common/duoWrapper';
import { ICustodianInfo, IEthBalance, ITokenBalance } from 'ts/common/types';
import util from 'ts/common/util';
import web3Util from 'ts/common/web3Util';
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

interface IProps {
	account: string;
	custodian: string;
	aToken: string;
	bToken: string;
	tokenBalances?: { [code: string]: ITokenBalance };
	ethBalance: IEthBalance;
	info?: ICustodianInfo;
	handleClose: () => void;
}

interface IState {
	custodian: string;
	infoExpand: boolean;
	isCreate: boolean;
	amount: string;
	wethAmount: string;
	wethCreate: boolean;
	allowance: number;
	loading: boolean;
	description: string;
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

const getBTokenPerETH = (info?: ICustodianInfo) =>
	info ? (info.states.resetPrice * info.states.beta) / (1 + info.states.alpha) : 0;

const getATokenPerETH = (bTokenPerETH: number, info?: ICustodianInfo) =>
	info ? bTokenPerETH * info.states.alpha : 0;

export default class ConvertCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			custodian: props.custodian,
			infoExpand: false,
			isCreate: true,
			amount: '',
			wethAmount: '',
			wethCreate: false,
			allowance: 0,
			loading: false,
			description: `Create ${props.aToken} and ${props.bToken} with ETH`
		};
	}

	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.custodian !== prevState.custodian)
			return {
				custodian: nextProps.custodian,
				infoExpand: false,
				isCreate: true,
				amount: '',
				amountError: '',
				wethAmount: '',
				wethAmountError: '',
				wethCreate: false,
				allowance: 0,
				loading: false,
				description: `Create ${nextProps.aToken} and ${nextProps.bToken} with ETH`
			};

		return null;
	}

	private handleSideChange = () =>
		this.setState({
			isCreate: !this.state.isCreate,
			wethCreate: false,
			amount: '',
			wethAmount: '',
			description: this.state.isCreate
				? `Redeem ETH from ${this.props.aToken} and ${this.props.bToken}`
				: `Create ${this.props.aToken} and ${this.props.bToken} with ETH`
		});

	private handleInfoExpandChange = () =>
		this.setState({
			infoExpand: !this.state.infoExpand
		});

	private handleAmountBlurChange = (value: string, limit: number) => {
		const { info, aToken, bToken } = this.props;
		const { isCreate } = this.state;
		const defaultDescription = isCreate
			? `Create ${aToken} and ${bToken} with ETH`
			: `Redeem ETH from ${aToken} and ${bToken}`
		if (value.match(CST.RX_NUM_P)) {
			const amountNum = Math.min(Number(value), limit);
			const bTokenPerETH = getBTokenPerETH(info);
			const aTokenPerETH = getATokenPerETH(bTokenPerETH, info);
			this.setState({
				amount: amountNum + '',
				description:
					!amountNum || !info
						? defaultDescription
						: isCreate
						? `${util.formatBalance(amountNum)} ETH --> ${util.formatBalance(
								amountNum * aTokenPerETH
						)} ${aToken} ${util.formatBalance(
								amountNum * bTokenPerETH
						)} ${bToken} with ${util.formatBalance(
								amountNum * info.states.createCommRate
						)} ETH fee`
						: `${util.formatBalance(amountNum)} ${aToken} ${util.formatBalance(
								amountNum / info.states.alpha
						)} ${bToken} --> ${util.formatBalance(
								amountNum / aTokenPerETH
						)} ETH with ${util.formatBalance(
								(amountNum / aTokenPerETH) * info.states.redeemCommRate
						)} ETH fee`
			});
		} else
			this.setState({
				amount: '',
				description: defaultDescription
			});
	};

	private handleAmountInputChange = (value: string) => {
		console.log(value);
		this.setState({
			amount: value
		});
	};

	private handleWethAmountInputBlurChange = (value: string, limit: number) => {
		const { info, aToken, bToken } = this.props;
		const defaultDescription = `Create ${aToken} and ${bToken} with WETH`
		if (value.match(CST.RX_NUM_P)) {
			const amountNum = Math.min(Number(value), limit);
			const bTokenPerETH = getBTokenPerETH(info);
			const aTokenPerETH = getATokenPerETH(bTokenPerETH, info);
			this.setState({
				wethAmount: Math.min(Number(value), limit) + '',
				description:
					!amountNum || !info
						? defaultDescription
						: `${util.formatBalance(amountNum)} WETH --> ${util.formatBalance(
								amountNum * aTokenPerETH
						)} ${aToken} ${util.formatBalance(
								amountNum * bTokenPerETH
						)} ${bToken} with ${util.formatBalance(
								amountNum * info.states.createCommRate
						)} ${CST.TH_ETH} fee`
			});
		} else
			this.setState({
				wethAmount: '',
				description: defaultDescription
			});
	};

	private handleWethAmountInputChange = (value: string) => {
		this.setState({
			wethAmount: value
		});
	};

	private handleWethCreateChange = () => {
		if (!this.state.wethCreate) {
			const { account, custodian } = this.props;
			duoWeb3Wrapper
				.getErc20Allowance(web3Util.contractAddresses.etherToken, account, custodian)
				.then(allownace => {
					this.setState({
						allowance: allownace,
						loading: false
					});
				});
		}

		this.setState({
			wethCreate: !this.state.wethCreate,
			amount: '',
			wethAmount: '',
			allowance: 0,
			loading: true,
			description: `Create ${this.props.aToken} and ${this.props.bToken} with ${
				this.state.wethCreate ? CST.TH_ETH : CST.TH_WETH
			}`
		});
	};

	private handleWETHApprove = async () => {
		this.setState({ loading: true });
		const { account, custodian } = this.props;
		try {
			await duoWeb3Wrapper.erc20Approve(
				web3Util.contractAddresses.etherToken,
				account,
				custodian,
				0,
				true
			);
			const interval = setInterval(() => {
				duoWeb3Wrapper
					.getErc20Allowance(web3Util.contractAddresses.etherToken, account, custodian)
					.then(allownace => {
						if (allownace) {
							this.setState({
								allowance: allownace,
								loading: false
							});
							clearInterval(interval);
						}
					});
			}, 10000);
		} catch (error) {
			this.setState({ loading: false });
		}
	};

	private handleSubmit = async () => {
		const { account, custodian, handleClose, info } = this.props;
		const { isCreate, amount, wethCreate } = this.state;
		const cw = getDualClassWrapper(custodian);
		if (!info || !cw) {
			alert('missing data');
			return;
		}

		if (isCreate)
			if (wethCreate)
				await cw.createWithWETH(
					account,
					Number(amount),
					web3Util.contractAddresses.etherToken,
					hash => alert(hash)
				);
			else await cw.create(account, Number(amount), hash => alert(hash));
		else
			await cw.redeem(account, Number(amount), Number(amount) / info.states.alpha, hash =>
				alert(hash)
			);

		handleClose();
	};

	public render() {
		const {
			handleClose,
			custodian,
			info,
			aToken,
			bToken,
			tokenBalances,
			ethBalance
		} = this.props;
		const {
			isCreate,
			infoExpand,
			amount,
			wethAmount,
			wethCreate,
			allowance,
			loading,
			description
		} = this.state;
		const bTokenPerETH = getBTokenPerETH(info);
		const aTokenPerETH = getATokenPerETH(bTokenPerETH, info);
		const limit = isCreate
			? wethCreate
				? ethBalance.weth
				: Math.round(ethBalance.eth * 99) / 100
			: tokenBalances && info
			? Math.min(
					tokenBalances[aToken].balance,
					tokenBalances[bToken].balance / info.states.alpha
			)
			: 0;
		return (
			<div style={{ display: !!custodian ? 'block' : 'none' }}>
				<div className="popup-bg" onClick={handleClose} />
				<SCard
					title={
						<SCardTitle>
							{CST.TH_CONVERT + (info ? ' ' + info.code.split('-')[0] : '')}
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
									<span className="title">
										{wethCreate ? CST.TH_WETH : CST.TH_ETH}
									</span>
									<span className="content">
										{util.formatBalance(
											wethCreate ? ethBalance.weth : ethBalance.eth
										)}
									</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{aToken}</span>
									<span className="content">
										{util.formatBalance(
											tokenBalances && tokenBalances[aToken]
												? tokenBalances[aToken].balance
												: 0
										)}
									</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{bToken}</span>
									<span className="content">
										{util.formatBalance(
											tokenBalances && tokenBalances[bToken]
												? tokenBalances[bToken].balance
												: 0
										)}
									</span>
								</li>
							</ul>
						</div>
					</SCardList>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li className="block-title" style={{ padding: '5px 15px' }}>
									{CST.TH_CUSTODIAN}
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{CST.TH_CONV_RATIO}</span>
									<span className="content">{`1 ${
										CST.TH_ETH
									} = ${util.formatNumber(aTokenPerETH)} ${aToken.substring(
										0,
										1
									)} + ${util.formatNumber(bTokenPerETH)} ${bToken.substring(
										0,
										1
									)}`}</span>
								</li>
							</ul>
						</div>
					</SCardList>
					<SCardList>
						<div className="status-list-wrapper">
							<ul
								style={{
									margin: '-1px 0',
									height: infoExpand ? '128px' : '0px'
								}}
							>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{CST.TH_MATURITY}</span>
									<span className="content">
										{util.formatMaturity(info ? info.states.maturity : 0)}
									</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{CST.TH_COLLATERAL}</span>
									<span className="content">
										{util.formatBalance(info ? info.states.ethCollateral : 0) +
											' ' +
											CST.TH_ETH}
									</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{CST.TH_TOTAL_SUPPLY}</span>
									<span className="content">
										{util.formatBalance(info ? info.states.totalSupplyA : 0) +
											' ' +
											aToken}
									</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">{''}</span>
									<span className="content">
										{util.formatBalance(info ? info.states.totalSupplyB : 0) +
											' ' +
											bToken}
									</span>
								</li>
							</ul>
						</div>
					</SCardList>
					<SCardList>
						<div className="status-list-wrapper">
							<ul style={{ margin: !infoExpand ? '-1px 0 0 0' : '0' }}>
								<li
									onClick={() => this.handleInfoExpandChange()}
									className="list-expand-button"
								>
									{infoExpand ? '∧' : '···'}
								</li>
							</ul>
						</div>
					</SCardList>
					<SCardConversionForm>
						<SDivFlexCenter horizontal width="100%" padding="10px;">
							{[CST.TH_CREATE, CST.TH_REDEEM].map(side => (
								<button
									key={side}
									className={
										(isCreate && side === CST.TH_CREATE) ||
										(!isCreate && side === CST.TH_REDEEM)
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
											marginBottom: 0,
											pointerEvents: wethCreate ? 'none' : 'auto',
											opacity: wethCreate ? 0.3 : 1
										}}
									>
										<SInput
											width="100%"
											value={amount}
											placeholder={
												(isCreate ? CST.TH_ETH : aToken) +
												'' +
												CST.TH_AMOUNT
											}
											onChange={e =>
												this.handleAmountInputChange(e.target.value)
											}
											onBlur={e =>
												this.handleAmountBlurChange(e.target.value, limit)
											}
										/>
									</li>
									<li
										className={'input-line'}
										style={{
											padding: '0 15px',
											pointerEvents: wethCreate ? 'none' : 'auto',
											opacity: wethCreate ? 0.3 : 1
										}}
									>
										<SSlider marks={marks} step={10} defaultValue={0} />
									</li>
									{isCreate ? (
										<li
											className="waring-expand-button"
											style={{ padding: '0 10px 0 15px' }}
											onClick={() => this.handleWethCreateChange()}
										>
											<span>
												<img src={waring} style={{ marginRight: 2 }} />
												{`Click to create with ${
													wethCreate ? CST.TH_ETH : CST.TH_WETH
												}`}
											</span>
										</li>
									) : (
										<li style={{ padding: '0 10px 0 15px' }}>
											<span style={{ height: 18, width: '100%' }} />
										</li>
									)}
								</ul>
							</div>
						</SCardList>
						<SCardList noUlBorder noLiBorder>
							<div className="status-list-wrapper">
								<ul
									style={{
										margin: '0',
										height: wethCreate && isCreate ? '90px' : '0px'
									}}
								>
									{loading ? (
										'loading'
									) : allowance ? (
										[
											<li
												key="input"
												className={'input-line'}
												style={{ padding: '0 10px', marginBottom: 0 }}
											>
												<SInput
													width="100%"
													placeholder={
														(isCreate ? 'WETH ' : 'Token ') + 'Amount'
													}
													value={wethAmount}
													onBlur={e =>
														this.handleWethAmountInputBlurChange(
															e.target.value,
															limit
														)
													}
													onChange={e =>
														this.handleWethAmountInputChange(
															e.target.value
														)
													}
												/>
											</li>,
											<li
												key="slider"
												className={'input-line'}
												style={{ padding: '0 15px' }}
											>
												<SSlider marks={marks} step={10} defaultValue={0} />
											</li>
										]
									) : (
										<button onClick={this.handleWETHApprove}>Approve</button>
									)}
								</ul>
							</div>
						</SCardList>
					</SCardConversionForm>
					<div className="convert-popup-des">{description}</div>
					<SDivFlexCenter horizontal width="100%" padding="10px">
						<SButton
							onClick={() => this.setState({ amount: '', wethAmount: '' })}
							width="49%"
						>
							{CST.TH_RESET}
						</SButton>
						<SButton width="49%" onClick={this.handleSubmit}>
							{CST.TH_SUBMIT}
						</SButton>
					</SDivFlexCenter>
				</SCard>
			</div>
		);
	}
}
