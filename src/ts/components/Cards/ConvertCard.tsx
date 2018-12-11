import close from 'images/icons/close.svg';
import help from 'images/icons/help.svg';
import waring from 'images/icons/waring.svg';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { ICustodianInfo } from 'ts/common/types';
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

interface IProps {
	custodian: string;
	info?: ICustodianInfo;
	handleClose: () => void;
}

interface IState {
	custodian: string;
	infoExpand: boolean;
	isCreate: boolean;
	ethAmount: string;
	wethAmount: string;
	wethCreate: boolean;
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

export default class ConvertCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			custodian: props.custodian,
			infoExpand: false,
			isCreate: true,
			ethAmount: '',
			wethAmount: '',
			wethCreate: false
		};
	}
	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.custodian !== prevState.custodian)
			return {
				custodian: nextProps.custodian,
				expand: false,
				isCreate: true,
				amount1: '',
				amount2: '',
				isExtraInput: false
			};

		return null;
	}

	private handleSideChange = () =>
		this.setState({
			isCreate: !this.state.isCreate
		});

	private handleInfoExpandChange = () =>
		this.setState({
			infoExpand: !this.state.infoExpand
		});

	private handleEthAmountInputChange = (value: string) =>
		this.setState({
			ethAmount: value
		});

	private handleWethAmountInputChange = (value: string) =>
		this.setState({
			wethAmount: value
		});

	private handleWethCreateChange = () =>
		this.setState({
			wethCreate: !this.state.wethCreate
		});

	public render() {
		const { handleClose, custodian, info } = this.props;
		const { isCreate, infoExpand, ethAmount, wethAmount, wethCreate } = this.state;
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
									{CST.TH_CUSTODIAN}
								</li>
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
									<span className="title">Param 3</span>
									<span className="content">1,234,567</span>
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
									<span className="title">Param 4</span>
									<span className="content">1,234,567</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">Param 5</span>
									<span className="content">1,234,567</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">Param 6</span>
									<span className="content">1,234,567</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">Param 7</span>
									<span className="content">1,234,567</span>
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
											placeholder={(isCreate ? 'ETH ' : 'Token ') + 'Amount'}
											value={ethAmount}
											onChange={e =>
												this.handleEthAmountInputChange(e.target.value)
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
									<li
										className="waring-expand-button"
										style={{ padding: '0 10px 0 15px' }}
										onClick={() => this.handleWethCreateChange()}
									>
										<span>
											<img src={waring} style={{ marginRight: 2 }} />
											{isCreate ? 'Create from ' : 'Redeem to '} ETH, click to{' '}
											{isCreate ? 'create from ' : 'redeem to '} WETH
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
										height: wethCreate ? '90px' : '0px'
									}}
								>
									<li
										className={'input-line'}
										style={{ padding: '0 10px', marginBottom: 0 }}
									>
										<SInput
											width="100%"
											placeholder={(isCreate ? 'WETH ' : 'Token ') + 'Amount'}
											value={wethAmount}
											onChange={e =>
												this.handleWethAmountInputChange(e.target.value)
											}
										/>
									</li>
									<li className={'input-line'} style={{ padding: '0 15px' }}>
										<SSlider marks={marks} step={10} defaultValue={0} />
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
							onClick={() => this.setState({ ethAmount: '', wethAmount: '' })}
							width="49%"
						>
							{CST.TH_RESET}
						</SButton>
						<SButton width="49%">{CST.TH_SUBMIT}</SButton>
					</SDivFlexCenter>
				</SCard>
			</div>
		);
	}
}
