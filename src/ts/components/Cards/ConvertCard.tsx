import { Spin } from 'antd';
import close from 'images/icons/close.svg';
import help from 'images/icons/help.svg';
import waring from 'images/icons/waring.svg';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { duoWeb3Wrapper, getDualClassWrapper, getTokensPerEth } from 'ts/common/duoWrapper';
import { ICustodianInfo, IEthBalance, INotification, ITokenBalance } from 'ts/common/types';
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
	notify: (notification: INotification) => any;
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

const getDescription = (
	wethCreate: boolean,
	isCreate: boolean,
	aToken: string,
	bToken: string,
	amount: number,
	info?: ICustodianInfo
) => {
	const ethCode = wethCreate && isCreate ? CST.TH_WETH : CST.TH_ETH;
	if (!amount || !info)
		return isCreate
			? `Create ${aToken} and ${bToken} with ${ethCode}`
			: `Redeem ETH from ${aToken} and ${bToken}`;
	const [aTokenPerEth, bTokenPerEth] = info ? getTokensPerEth(info.states) : [0, 0];

	const ethNum = isCreate ? amount : amount / aTokenPerEth;
	const feeNum = ethNum * (isCreate ? info.states.createCommRate : info.states.redeemCommRate);
	const ethAfterFeeNum = ethNum - feeNum;
	const aTokenAmt = util.formatBalance(ethAfterFeeNum * aTokenPerEth);
	const bTokenAmt = util.formatBalance(ethAfterFeeNum * bTokenPerEth);
	const feeAmt = util.formatBalance(feeNum);
	const ethAmt = util.formatBalance(ethAfterFeeNum);

	return isCreate
		? `${ethAmt}(after fee ${feeAmt}) ${ethCode} --> ${aTokenAmt} ${aToken} + ${bTokenAmt} ${bToken}`
		: `${aTokenAmt} ${aToken} + ${bTokenAmt} ${bToken} --> ${ethAmt}(after fee ${feeAmt}) ${ethCode}`;
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
		const { account, custodian, notify } = this.props;
		try {
			const txHash = await duoWeb3Wrapper.erc20Approve(
				web3Util.contractAddresses.etherToken,
				account,
				custodian,
				0,
				true
			);
			notify({
				level: 'info',
				title: CST.TH_WETH,
				message: 'Approval transaction sent.',
				transactionHash: txHash
			});
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
		const { account, custodian, handleClose, info, notify } = this.props;
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
			notify({
				level: 'info',
				title: `${isCreate ? 'Creation' : 'Redemption'}`,
				message: description,
				transactionHash: isCreate
					? await cw.create(
							account,
							wethCreate ? Number(wethAmount) : Number(amount),
							wethCreate ? web3Util.contractAddresses.etherToken : ''
					)
					: await cw.redeem(account, Number(amount), Number(amount) / info.states.alpha)
			});
			handleClose();
		} catch (error) {
			this.setState({
				loading: false
			});
		}
	};
	private TokenDescription = (props: { aToken: string; bToken: string }) => {
		return props.aToken.startsWith('a') ? (
			<span>
				{` ${props.aToken} provides a fixed stream of `}
				<span className="aspan" style={{ fontSize: 12 }}>
					{CST.TH_INCOME.toUpperCase()}
				</span>
				{` and ${props.bToken} provides `}
				<span className="aspan" style={{ fontSize: 12 }}>
					{CST.TH_LEVERAGE.toUpperCase()}
				</span>
				{` return.`}
			</span>
		) : (
			<span>
				{` ${props.aToken} represents `}
				<span className="aspan" style={{ fontSize: 12 }}>
					{CST.TH_SHORT.toUpperCase()}
				</span>
				{` positions and ${props.bToken} represents margin `}
				<span className="aspan" style={{ fontSize: 12 }}>
					{CST.TH_LONG.toUpperCase()}
				</span>
				{` positions.`}
			</span>
		);
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
		const [aTokenPerEth, bTokenPerEth] = info ? getTokensPerEth(info.states) : [0, 0];
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
							{CST.TH_CONVERT + ' ' + (isBeethoven ? CST.BEETHOVEN : CST.MOZART)}
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
					<div
						className="cus-link"
						onClick={() =>
							window.open(
								`https://kovan.duo.network/${
									info ? info.code.split('-')[0].toLowerCase() : ''
								}/${
									info
										? info.code.split('-')[1]
											? info.code.split('-')[1].toLowerCase()
											: 'perpetual'
										: ''
								}`,
								'_blank'
							)
						}
					>
						<div className="convert-popup-des">
							Fully backed by ETH, this contract converts between ETH and tokens with
							diversified payoffs.
							<this.TokenDescription aToken={aToken} bToken={bToken} />
						</div>
						<div className="convert-popup-des">{util.getMaturityDescription(info)}</div>
					</div>
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
									} = ${util.formatNumber(aTokenPerEth)} ${aToken.substring(
										0,
										1
									)} + ${util.formatNumber(bTokenPerEth)} ${bToken.substring(
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
												justifyContent: 'space-between'
											}}
										>
											<div
												className="tabletitle"
												style={{ textAlign: 'left', width: '20%' }}
											>
												{CST.TH_TOKEN}
											</div>
											<div className="tabletitle2">{aToken}</div>
											<div className="tabletitle2">{bToken}</div>
											<div className="tabletitle2" style={{ width: '20%' }}>
												{wethCreate ? CST.TH_WETH : CST.TH_ETH}
											</div>
										</li>
										<li
											style={{
												padding: '5px 15px',
												justifyContent: 'space-between'
											}}
										>
											<div
												className="tabletitle"
												style={{ textAlign: 'left', width: '20%' }}
											>
												{CST.TH_BALANCE}
											</div>
											<div className="tablecontent2">
												{util.formatBalance(
													tokenBalances && tokenBalances[aToken]
														? tokenBalances[aToken].balance
														: 0
												)}
											</div>
											<div className="tablecontent2">
												{util.formatBalance(
													tokenBalances && tokenBalances[bToken]
														? tokenBalances[bToken].balance
														: 0
												)}
											</div>
											<div className="tablecontent2" style={{ width: '20%' }}>
												{util.formatBalance(
													wethCreate ? ethBalance.weth : ethBalance.eth
												)}
											</div>
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
													top: infoExpand ? '620px' : '500px'
												}}
											>
												<li
													style={{
														position: 'fixed',
														top: infoExpand ? '658px' : '530px',
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
								style={{
									opacity:
										limit === 0 ||
										Number(isCreate && wethCreate ? wethAmount : amount) === 0
											? 0.3
											: 1
								}}
								width="49%"
								onClick={this.handleSubmit}
							>
								{isCreate ? CST.TH_CREATE : CST.TH_REDEEM}
							</SButton>
						</SDivFlexCenter>
					</Spin>
				</SCard>
			</div>
		);
	}
}
