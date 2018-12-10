import close from 'images/icons/close.svg';
import help from 'images/icons/help.svg';
import waring from 'images/icons/waring.svg';
import * as React from 'react';
import * as CST from 'ts/common/constants';
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
	title: string;
	toggleDisplay: () => void;
	display: boolean;
}

interface IState {
	isExpand: boolean;
	isCreate: boolean;
	amount1: string;
	amount2: string;
	isExtraInput: boolean;
	display: boolean;
}

export default class ConvertCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isExpand: false,
			isCreate: true,
			amount1: '',
			amount2: '',
			isExtraInput: false,
			display: props.display
		};
	}
	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (nextProps.display !== prevState.display)
			return {
				isExpand: false,
				isCreate: true,
				amount1: '',
				amount2: '',
				isExtraInput: false,
				display: nextProps.display
			};

		return null;
	}

	private handleSideChange = () =>
		this.setState({
			isCreate: !this.state.isCreate
		});
	private handleExpandChange = () =>
		this.setState({
			isExpand: !this.state.isExpand
		});
	private handleExtraInputChange = () =>
		this.setState({
			isExtraInput: !this.state.isExtraInput,
			amount1: '',
			amount2: ''
		});
	private handleAmount1InputChange = (value: string) =>
		this.setState({
			amount1: value
		});
	private handleAmount2InputChange = (value: string) =>
		this.setState({
			amount2: value
		});
	public render() {
		const { title, toggleDisplay, display } = this.props;
		const { isCreate, isExpand, amount1, amount2, isExtraInput } = this.state;
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
		return (
			<div style={{ display: display ? 'block' : 'none' }}>
				<div className="popup-bg" onClick={toggleDisplay} />
				<SCard
					title={<SCardTitle>{CST.TH_CONVERT.toUpperCase()}</SCardTitle>}
					width="400px"
					className="popup-card"
					noBodymargin
					extra={
						<SDivFlexCenter horizontal width="40px">
							<img className="cardpopup-close" src={help} />
							<img className="cardpopup-close" src={close} onClick={toggleDisplay} />
						</SDivFlexCenter>
					}
				>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li className="block-title" style={{ padding: '5px 15px' }}>
									{title}
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">Param 1</span>
									<span className="content">1,234,567</span>
								</li>
								<li style={{ padding: '5px 15px' }}>
									<span className="title">Param 2</span>
									<span className="content">1,234,567</span>
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
									height: isExpand ? '128px' : '0px'
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
							<ul style={{ margin: !isExpand ? '-1px 0 0 0' : '0' }}>
								<li
									onClick={() => this.handleExpandChange()}
									className="list-expand-button"
								>
									{isExpand ? '∧' : '···'}
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
											pointerEvents: isExtraInput ? 'none' : 'auto',
											opacity: isExtraInput ? 0.3 : 1
										}}
									>
										<SInput
											width="100%"
											placeholder={(isCreate ? 'ETH ' : 'Token ') + 'Amount'}
											value={amount1}
											onChange={e =>
												this.handleAmount1InputChange(e.target.value)
											}
										/>
									</li>
									<li
										className={'input-line'}
										style={{
											padding: '0 15px',
											pointerEvents: isExtraInput ? 'none' : 'auto',
											opacity: isExtraInput ? 0.3 : 1
										}}
									>
										<SSlider marks={marks} step={10} defaultValue={0} />
									</li>
									<li
										className="waring-expand-button"
										style={{ padding: '0 10px 0 15px' }}
										onClick={() => this.handleExtraInputChange()}
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
										height: isExtraInput ? '90px' : '0px'
									}}
								>
									<li
										className={'input-line'}
										style={{ padding: '0 10px', marginBottom: 0 }}
									>
										<SInput
											width="100%"
											placeholder={(isCreate ? 'WETH ' : 'Token ') + 'Amount'}
											value={amount2}
											onChange={e =>
												this.handleAmount2InputChange(e.target.value)
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
							onClick={() => this.setState({ amount1: '', amount2: '' })}
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