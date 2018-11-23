import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IEthBalance, ITokenBalance } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput } from './_styled';

interface IProps {
	account: string;
	pair: string;
	ethBalance: IEthBalance;
	tokenBalance: ITokenBalance;
}

interface IState {
	isBid: boolean;
	price: string;
	amount: string;
	hoursToLive: number;
}

export default class OrderCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isBid: true,
			price: '',
			amount: '',
			hoursToLive: 8
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
			.addOrder(account, pair, Number(price), Number(amount), isBid, hoursToLive * 3600)
			.then(() =>
				this.setState({
					price: '',
					amount: ''
				})
			);
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

	private handleExpireButtonClick = (hour: number) =>
		this.setState({
			hoursToLive: hour
		});

	private handleClear = () =>
		this.setState({
			price: '',
			amount: '',
			hoursToLive: 8
		});

	public render() {
		const { ethBalance, tokenBalance } = this.props;
		const { isBid, price, amount, hoursToLive } = this.state;
		const approveRequired = isBid
			? !ethBalance.allowance || ethBalance.allowance < ethBalance.weth
			: !tokenBalance.allowance || tokenBalance.allowance < tokenBalance.balance;
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
										padding="5px 10px 0 0"
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
										<li key={CST.TH_PX} className="input-line bg-dark">
											{CST.TH_PX}
											<SInput
												width="60%"
												className="bg-dark"
												value={price}
												onChange={e =>
													this.handlePriceInputChange(e.target.value)
												}
												right
											/>
										</li>,
										<li key={CST.TH_AMT} className={'input-line'}>
											{CST.TH_AMT}
											<SInput
												width="60%"
												className={''}
												value={amount}
												onChange={e =>
													this.handleAmountInputChange(e.target.value)
												}
												right
											/>
										</li>,
										<li key={CST.TH_EXPIRY} className={'input-line'}>
											<span className="title" style={{ width: 200 }}>
												{CST.TH_EXPIRY}
											</span>
											<SDivFlexCenter
												horizontal
												width="100%"
												padding="2px 0 2px 0"
											>
												{[8, 16, 24, 36].map(hour => (
													<button
														key={hour}
														className={
															hoursToLive === hour
																? 'button'
																: 'percent-button'
														}
														onClick={() =>
															this.handleExpireButtonClick(hour)
														}
													>
														{hour + 'h'}
													</button>
												))}
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
