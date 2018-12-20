import { Spin } from 'antd';
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
	notification: (level: string, message: string, txHash: string) => any;
	handleClose: () => void;
}

interface IState {
	account: string;
	custodian: string;
	infoExpand: boolean;
	isCreate: boolean;
	amount: string;
	wethAmount: string;
	wethCreate: boolean;
	allowance: number;
	loading: boolean;
	description: string;
	sliderValue: number;
	sliderWETH: number;
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

const getDescription = (
	wethCreate: boolean,
	isCreate: boolean,
	aToken: string,
	bToken: string,
	amount: number,
	info?: ICustodianInfo
) => {
	console.log(amount);
	const ethCode = wethCreate && isCreate ? CST.TH_WETH : CST.TH_ETH;
	if (!amount || !info)
		return isCreate
			? `Create ${aToken} and ${bToken} with ${ethCode}`
			: `Redeem ETH from ${aToken} and ${bToken}`;
	const bTokenPerETH = getBTokenPerETH(info);
	const aTokenPerETH = getATokenPerETH(bTokenPerETH, info);

	const ethNum = isCreate ? amount : amount / aTokenPerETH;
	const aTokenAmt = util.formatBalance(isCreate ? amount * aTokenPerETH : amount);
	const bTokenAmt = util.formatBalance(
		isCreate ? amount * bTokenPerETH : amount / info.states.alpha
	);
	const feeAmt = util.formatBalance(
		ethNum * (isCreate ? info.states.createCommRate : info.states.redeemCommRate)
	);
	const ethAmt = util.formatBalance(ethNum);

	return isCreate
		? `${ethAmt} ${ethCode} --> ${aTokenAmt} ${aToken} + ${bTokenAmt} ${bToken} with ${feeAmt} ${ethCode} fee`
		: `${aTokenAmt} ${aToken} + ${bTokenAmt} ${bToken} --> ${ethAmt} ${ethCode} with ${feeAmt} ${ethCode} fee`;
};

export default class ConvertCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			account: props.account,
			custodian: props.custodian,
			infoExpand: false,
			isCreate: true,
			amount: '',
			wethAmount: '',
			wethCreate: false,
			allowance: 0,
			loading: false,
			description: `Create ${props.aToken} and ${props.bToken} with ETH`,
			sliderValue: 0,
			sliderWETH: 0
		};
	}

	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.account !== prevState.account || nextProps.custodian !== prevState.custodian)
			return {
				account: nextProps.account,
				custodian: nextProps.custodian,
				infoExpand: false,
				isCreate: true,
				amount: '',
				sliderValue: 0,
				sliderWETH: 0,
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
			sliderValue: 0,
			sliderWETH: 0,
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
		if (value.match(CST.RX_NUM_P) && limit) {
			const amountNum = Math.min(Number(value), limit);
			this.setState({
				amount: amountNum + '',
				description: getDescription(false, isCreate, aToken, bToken, amountNum, info),
				sliderValue: (amountNum / limit) * 100
			});
		} else
			this.setState({
				amount: '',
				sliderValue: 0,
				description: isCreate
					? `Create ${aToken} and ${bToken} with ETH`
					: `Redeem ETH from ${aToken} and ${bToken}`
			});
	};

	private handleAmountInputChange = (value: string) => {
		this.setState({
			amount: value
		});
	};

	private handleWethAmountInputBlurChange = (value: string, limit: number) => {
		const { info, aToken, bToken } = this.props;
		if (value.match(CST.RX_NUM_P) && limit) {
			const amountNum = Math.min(Number(value), limit);
			this.setState({
				wethAmount: Math.min(Number(value), limit) + '',
				description: getDescription(true, true, aToken, bToken, amountNum, info),
				sliderWETH: (amountNum / limit) * 100
			});
		} else
			this.setState({
				wethAmount: '',
				sliderWETH: 0,
				description: `Create ${aToken} and ${bToken} with WETH`
			});
	};

	private handleWethAmountInputChange = (value: string) => {
		this.setState({
			wethAmount: value
		});
	};

	private handleSliderWETHChange(e: string, limit: number) {
		const { info, aToken, bToken } = this.props;
		const amountNum = (limit * Number(e)) / 100;
		if (amountNum)
			this.setState({
				wethAmount: util.formatBalance(amountNum),
				description: getDescription(true, true, aToken, bToken, amountNum, info),
				sliderWETH: Number(e)
			});
		else
			this.setState({
				wethAmount: '',
				description: `Create ${aToken} and ${bToken} with WETH`,
				sliderWETH: 0
			});
	}

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
			sliderValue: 0,
			wethAmount: '',
			sliderWETH: 0,
			allowance: 0,
			loading: !this.state.wethCreate,
			description: `Create ${this.props.aToken} and ${this.props.bToken} with ${
				this.state.wethCreate ? CST.TH_ETH : CST.TH_WETH
			}`
		});
	};

	private handleWETHApprove = async () => {
		this.setState({ loading: true });
		const { account, custodian, notification } = this.props;
		try {
			await duoWeb3Wrapper.erc20Approve(
				web3Util.contractAddresses.etherToken,
				account,
				custodian,
				0,
				(hash: string) => notification('info', 'WETH approval transaction sent.', hash),
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

	private handleSliderChange(e: string, limit: number) {
		const { info, aToken, bToken } = this.props;
		const { isCreate } = this.state;
		const amountNum = (limit * Number(e)) / 100;
		if (amountNum)
			this.setState({
				amount: util.formatBalance(amountNum),
				description: getDescription(false, isCreate, aToken, bToken, amountNum, info),
				sliderValue: Number(e)
			});
		else
			this.setState({
				amount: '',
				description: isCreate
					? `Create ${aToken} and ${bToken} with ETH`
					: `Redeem ETH from ${aToken} and ${bToken}`,
				sliderValue: 0
			});
	}

	private handleSubmit = async () => {
		this.setState({
			loading: true
		});
		const { account, custodian, handleClose, info, notification } = this.props;
		const { isCreate, amount, wethCreate, wethAmount, description } = this.state;
		const cw = getDualClassWrapper(custodian);
		if (!info || !cw) {
			this.setState({
				loading: false
			});
			alert('missing data');
			return;
		}

		try {
			const onTxHash = (hash: string) => {
				notification('info', description, hash);
				handleClose();
			};
			if (isCreate)
				if (wethCreate)
					await cw.createWithWETH(
						account,
						Number(wethAmount),
						web3Util.contractAddresses.etherToken,
						onTxHash
					);
				else await cw.create(account, Number(amount), onTxHash);
			else
				await cw.redeem(
					account,
					Number(amount),
					Number(amount) / info.states.alpha,
					onTxHash
				);
		} catch (error) {
			this.setState({
				loading: false
			});
		}
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
			description,
			sliderValue,
			sliderWETH
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

		const contractCode = info ? info.code.split('-')[0] : '';
		const isBeethoven = contractCode === CST.BEETHOVEN.toUpperCase();

		return (
			<div style={{ display: !!custodian ? 'block' : 'none' }}>
				<div className={'popup-bg ' + (!!custodian ? 'popup-open-bg' : '')} />
				<SCard
					title={
						<SCardTitle>
							{CST.TH_CONVERT + (info ? ' ' + info.code.split('-')[0] : '')}
						</SCardTitle>
					}
					width="360px"
					className={'popup-card ' + (!!custodian ? 'popup-open' : '')}
					noBodymargin
					extra={
						<SDivFlexCenter horizontal width="40px">
							<img className="cardpopup-close" src={help} />
							<img className="cardpopup-close" src={close} onClick={handleClose} />
						</SDivFlexCenter>
					}
				>
					<div className="convert-popup-des">
						{util.getContractDescription(isBeethoven)}
					</div>
					<div className="convert-popup-des">
						{util.getTokenDescription(aToken, bToken)}
					</div>
					<div className="convert-popup-des">{util.getMaturityDescription(info)}</div>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li
									className="block-title"
									style={{ padding: '5px 15px', justifyContent: 'center' }}
								>
									{CST.TH_CONV_RATIO}
								</li>
								<li style={{ padding: '5px 15px', justifyContent: 'center' }}>
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
					<Spin
						spinning={loading}
						tip={wethCreate && !allowance ? 'Approving' : 'Submitting...'}
					>
						<SCardConversionForm>
							<SDivFlexCenter
								horizontal
								width="100%"
								padding="10px"
								style={{
									opacity: wethCreate ? 0.3 : 1,
									pointerEvents: wethCreate ? 'none' : 'auto'
								}}
							>
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
							<SCardList noMargin width="100%">
								<div className="status-list-wrapper">
									<ul>
										<li
											style={{
												padding: '5px 15px',
												justifyContent: 'space-around'
											}}
										>
											<span className="title">
												{wethCreate ? CST.TH_WETH : CST.TH_ETH}
											</span>
											<span className="title">{aToken}</span>
											<span className="title">{bToken}</span>
										</li>
										<li
											style={{
												padding: '5px 15px',
												justifyContent: 'space-around'
											}}
										>
											<span className="content">
												{util.formatBalance(
													wethCreate ? ethBalance.weth : ethBalance.eth
												)}
											</span>
											<span className="content">
												{util.formatBalance(
													tokenBalances && tokenBalances[aToken]
														? tokenBalances[aToken].balance
														: 0
												)}
											</span>
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
											<span className="input-des">
												{(isCreate ? CST.TH_ETH : aToken) +
													' ' +
													CST.TH_AMOUNT}
											</span>
											<SInput
												right
												disabled={limit === 0}
												width="100%"
												value={amount}
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
											style={{
												padding: '0 15px',
												pointerEvents: wethCreate ? 'none' : 'auto',
												opacity: wethCreate ? 0.3 : 1
											}}
										>
											<SSlider
												disabled={limit === 0}
												marks={marks}
												step={1}
												value={sliderValue}
												onChange={(e: any) =>
													this.handleSliderChange(e, limit)
												}
											/>
										</li>
										<li
											className="waring-expand-button"
											style={{
												padding: '0 10px 0 15px',
												pointerEvents:
													isCreate && ethBalance.weth ? 'auto' : 'none'
											}}
											onClick={() =>
												isCreate && this.handleWethCreateChange()
											}
										>
											<span
												style={{
													opacity: isCreate && ethBalance.weth ? 100 : 0
												}}
											>
												<img src={waring} style={{ marginRight: 2 }} />
												{`Click to create with ${
													wethCreate ? CST.TH_ETH : CST.TH_WETH
												}`}
											</span>
										</li>
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
										<li
											className={'input-line'}
											style={{ padding: '0 10px', marginBottom: 0 }}
										>
											{wethCreate && isCreate ? (
												<span className="input-des">
													{CST.TH_WETH + ' ' + CST.TH_AMOUNT}
												</span>
											) : null}
											<SInput
												right
												width="100%"
												disabled={limit === 0}
												value={wethAmount}
												onBlur={e =>
													this.handleWethAmountInputBlurChange(
														e.target.value,
														limit
													)
												}
												onChange={e =>
													this.handleWethAmountInputChange(e.target.value)
												}
											/>
										</li>
										<li className={'input-line'} style={{ padding: '0 15px' }}>
											<SSlider
												disabled={limit === 0}
												marks={marks}
												step={1}
												value={sliderWETH}
												onChange={(e: any) =>
													this.handleSliderWETHChange(e, limit)
												}
											/>
										</li>
										{!allowance && !loading && (wethCreate && isCreate) ? (
											<div
												className="pop-up-convert"
												style={{
													top: infoExpand ? '568px' : '440px'
												}}
											>
												<li
													style={{
														position: 'fixed',
														top: infoExpand ? '588px' : '460px',
														width: '100%',
														padding: '0 100px'
													}}
												>
													<SButton onClick={this.handleWETHApprove}>
														{CST.TH_APPROVE}
													</SButton>
												</li>
											</div>
										) : null}
									</ul>
								</div>
							</SCardList>
						</SCardConversionForm>
						<div className="convert-popup-des">{description}</div>
						<SDivFlexCenter horizontal width="100%" padding="10px">
							<SButton
								disable={limit === 0}
								onClick={() =>
									this.setState({
										amount: '',
										wethAmount: '',
										sliderValue: 0,
										sliderWETH: 0
									})
								}
								width="49%"
							>
								{CST.TH_RESET}
							</SButton>
							<SButton
								disable={
									limit === 0 ||
									Number(isCreate && wethCreate ? wethAmount : amount) === 0
								}
								style={{opacity: (limit === 0 ||
									Number(isCreate && wethCreate ? wethAmount : amount) === 0) ? 0.3 : 1}}
								width="49%"
								onClick={this.handleSubmit}
							>
								{CST.TH_SUBMIT}
							</SButton>
						</SDivFlexCenter>
					</Spin>
				</SCard>
			</div>
		);
	}
}
