//import moment from 'moment';
import * as React from 'react';
// import Web3 from 'web3';
import * as CST from '../../common/constants';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput } from './_styled';

interface IProps {
	submitOrders: (amount: number, price: number, action: string) => any;
}

interface IState {
	isCreate: boolean;
	amount: string;
	description: string;
	price: string;
}

export default class OperationCard extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isCreate: true,
			amount: '0',
			description: '',
			price: '0'
		};
	}

	private handleTypeChange = () =>
		this.setState({
			isCreate: !this.state.isCreate,
			amount: '0',
			price: '0',
			description: ''
		});

	private submit = async () => {
		const action = this.state.isCreate ? 'Sell' : 'Buy';

		this.props.submitOrders(
			parseFloat(this.state.amount),
			parseFloat(this.state.price),
			action
		);
	};

	private getDescription = () => {
		const { isCreate, price, amount } = this.state;

		this.setState({
			description: !isCreate
				? 'Buy ' + amount + ' at price ' + price
				: 'Sell ' + amount + ' at price ' + price
		});
	};

	private handleAmountInputChange = (value: string) =>
		this.setState({
			amount: value
		});

	private handlePriceInputChange = (price: string) => {
		this.setState({
			price: price
		});
	};

	private handleClear = () =>
		this.setState({
			amount: '0',
			price: '0',
			description: ''
		});

	public render() {
		return (
			<SCard
				title={<SCardTitle>{CST.TH_OPERA.toUpperCase()}</SCardTitle>}
				width="370px"
				margin="0 0 0 5px"
			>
				<SCardConversionForm>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className="block-title">
									<span>{CST.TH_TRADE}</span>
								</li>
								<li>
									<SDivFlexCenter
										horizontal
										width="100%"
										padding="5px 10px 0 0"
										marginBottom="10px"
									>
										<button
											className={
												this.state.isCreate
													? 'conv-button selected'
													: 'conv-button non-select'
											}
											onClick={() => this.handleTypeChange()}
										>
											{CST.TH_SELL}
										</button>
										<button
											className={
												!this.state.isCreate
													? 'conv-button selected'
													: 'conv-button non-select'
											}
											onClick={() => this.handleTypeChange()}
										>
											{CST.TH_BUY}
										</button>
									</SDivFlexCenter>
								</li>
								<li className="input-line bg-dark">
									<span className="title">{CST.TH_PX}</span>
									<SInput
										width="60%"
										className="bg-dark"
										value={this.state.price}
										onChange={e => this.handlePriceInputChange(e.target.value)}
										onBlur={() => this.getDescription()}
										placeholder="{CST.TT_INPUT_AMOUNT[locale]}"
										right
									/>
								</li>
								<li className={'input-line'}>
									<span className="title">{CST.TH_AMT}</span>
									<SInput
										width="60%"
										className={''}
										value={this.state.amount}
										onChange={e => this.handleAmountInputChange(e.target.value)}
										onBlur={() => this.getDescription()}
										placeholder="{CST.TT_INPUT_AMOUNT[locale]}"
										right
									/>
								</li>
								<li className="description">
									<div>{this.state.description}</div>
								</li>
								<li>
									<SDivFlexCenter
										horizontal
										width="100%"
										padding="0"
										marginTop="10px"
									>
										<button
											className={'form-button'}
											disabled={
												this.state.amount === '0' ||
												this.state.price === '0'
											}
											onClick={this.submit}
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
							</ul>
						</div>
					</SCardList>
				</SCardConversionForm>
			</SCard>
		);
	}
}
