import { Radio } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IEthBalance, ITokenBalance } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput, SSlider } from './_styled';
const RadioGroup = Radio.Group;
interface IProps {
	account: string;
	pair: string;
	ethBalance: IEthBalance;
	tokenBalance: ITokenBalance;
	step: number;
}

interface IState {
	isBid: boolean;
	price: string;
	amount: string;
	hoursToLive: number;
	value: number;
}

export default class OrderCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isBid: true,
			price: '',
			amount: '',
			hoursToLive: 8,
			value: 1
		};
	}

	private handleSideChange = () =>
		this.setState({
			isBid: !this.state.isBid
		});

	private handleSubmit = () => {
		const { account, pair } = this.props;
		const { isBid, price, amount, hoursToLive } = this.state;
		wsUtil
			.addOrder(
				account,
				pair,
				Number(price),
				Number(amount),
				isBid,
				hoursToLive * 3600,
			)
			.then(() =>
				this.setState({
					price: '',
					amount: ''
				})
			);
	};

	private handleBlurChange(e: string) {
		const step = this.props.step;
		this.setState({
			price: (Math.round(Number(e) / step) * step).toString()
		});
	}

	private onChange = (e: number) => {
		this.setState({
			value: e
		});
	};
	private handleApprove = () => {
		const { pair } = this.props;
		const { isBid } = this.state;
		const [code1, code2] = pair.split('|');
		web3Util.setUnlimitedTokenAllowance(isBid ? code2 : code1);
	};

	private handleAmountInputChange = (value: string) =>
		this.setState({
			amount: value
		});

	private handlePriceInputChange = (price: string) => this.setState({ price: price });

	private handleClear = () =>
		this.setState({
			price: '',
			amount: '',
			hoursToLive: 8
		});

	public render() {
		const { ethBalance, tokenBalance, step } = this.props;
		const { isBid, price, amount } = this.state;
		const approveRequired = isBid
			? !ethBalance.allowance || ethBalance.allowance < ethBalance.weth
			: !tokenBalance.allowance || tokenBalance.allowance < tokenBalance.balance;

		const marks = {
			0: {
				label: <strong>0</strong>
			},
			25: {
				label: <strong>25</strong>
			},
			50: {
				label: <strong>50</strong>
			},
			75: {
				label: <strong>75</strong>
			},
			100: {
				label: <strong>100</strong>
			}
		};

		return (
			<SCard
				title={<SCardTitle>{CST.TH_ORDER.toUpperCase()}</SCardTitle>}
				width="370px"
				margin="0 0 0 5px"
			>
				<SCardConversionForm>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className="block-title">
									<span>{this.props.pair.replace('|', '-')}</span>
								</li>
								<li>
									<SDivFlexCenter
										horizontal
										width="100%"
										padding="0"
										marginBottom="10px"
									>
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
								</li>
								{approveRequired ? (
									<button className={'form-button'} onClick={this.handleApprove}>
										{CST.TH_APPROVE}
									</button>
								) : (
									[
										<li key={CST.TH_PX} className={'input-line'}>
											<SInput
												width="100%"
												placeholder="Price"
												value={price}
												type={'number'}
												step={step}
												onChange={e =>
													this.handlePriceInputChange(e.target.value)
												}
												onBlur={e => this.handleBlurChange(e.target.value)}
											/>
										</li>,
										<li key={CST.TH_AMT} className={'input-line'}>
											<SInput
												width="100%"
												placeholder="Amount"
												value={amount}
												onChange={e =>
													this.handleAmountInputChange(e.target.value)
												}
											/>
										</li>,
										<li key={''} className={'input-line'}>
											<SSlider marks={marks} step={10} defaultValue={0} />
										</li>,
										<li key={CST.TH_EXPIRY} className={'input-line'}>
											<span className="title" style={{ width: 200 }}>
												{CST.TH_EXPIRY}
											</span>
											<SDivFlexCenter
												horizontal
												width="60%"
												padding="2px 0 2px 0"
											>
												<RadioGroup
													onChange={e => this.onChange(e.target.value)}
													value={this.state.value}
												>
													<Radio value={1}>Day</Radio>
													<Radio value={2}>Month</Radio>
												</RadioGroup>
											</SDivFlexCenter>
										</li>,
										<li key={CST.TH_SUBMIT}>
											<SDivFlexCenter
												horizontal
												width="100%"
												padding="0"
												marginTop="10px"
											>
												<button
													className={'form-button'}
													disabled={!price || !amount}
													onClick={this.handleSubmit}
												>
													{CST.TH_SUBMIT}
												</button>

												<button
													className={'form-button'}
													onClick={this.handleClear}
												>
													{CST.TH_CLEAR}
												</button>
											</SDivFlexCenter>
										</li>
									]
								)}
							</ul>
						</div>
					</SCardList>
				</SCardConversionForm>
			</SCard>
		);
	}
}
