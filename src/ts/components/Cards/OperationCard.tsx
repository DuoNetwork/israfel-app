import { Select } from 'antd';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import * as React from 'react';
import * as CST from '../../common/constants';
import wsUtil from '../../common/wsUtil';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput } from './_styled';

interface IState {
	isCreate: boolean;
	baseCurrency: string;
	description: string;
	price: string;
	targetCurrency: string;
	expireTime: string;
}

export default class OperationCard extends React.PureComponent<{}, IState> {
	constructor(props: object) {
		super(props);
		this.state = {
			isCreate: true,
			baseCurrency: '0',
			description: '',
			targetCurrency: '0',
			price: '0',
			expireTime: '0'
		};
	}

	private handleTypeChange = () =>
		this.setState({
			isCreate: !this.state.isCreate,
			baseCurrency: '0',
			targetCurrency: '0',
			description: '',
			price: '0',
			expireTime: '0'
		});

	private submit = async () => {
		const action = this.state.isCreate ? 'Sell' : 'Buy';
		await wsUtil.addOrder(
			Number(this.state.baseCurrency),
			Number(this.state.targetCurrency),
			action === 'Buy',
			this.state.expireTime
		);
	};

	private getDescription = () => {
		const { isCreate, targetCurrency, baseCurrency } = this.state;
		if (targetCurrency !== '0' && baseCurrency !== '0')
			this.setState({
				price: (Number(targetCurrency) / Number(baseCurrency)).toString()
			});
		else
			this.setState({
				price: '0'
			});

		this.setState({
			description: !isCreate
				? 'Buy ' + baseCurrency + ' with ' + targetCurrency
				: 'Sell ' + baseCurrency + ' with ' + targetCurrency
		});
	};

	private handleAmountInputChange = (value: string) =>
		this.setState({
			baseCurrency: value
		});

	private handlePriceInputChange = (price: string) => {
		const { baseCurrency } = this.state;
		if (price > '0')
			this.setState({
				targetCurrency: (Number(price) * Number(baseCurrency)).toString()
			});
		this.setState({
			price: price
		});
	};

	private handleTargetCurrencyInput = (targetCurrency: string) => {
		this.setState({
			targetCurrency: targetCurrency
		});
	};

	private handleExpireTime(time: Moment, timeString: string) {
		this.setState({
			expireTime: timeString
		});
		console.log(time.toString());
	}

	private handleClear = () =>
		this.setState({
			baseCurrency: '0',
			targetCurrency: '0',
			description: '',
			price: '0'
		});

	public render() {
		const Option = Select.Option;
		const children = [];
		for (let i = 0; i < CST.TH_CURRENCY.length; i++)
			children.push(<Option key={CST.TH_CURRENCY[i]}>{CST.TH_CURRENCY[i]}</Option>);

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
									<Select
										showSearch
										style={{ width: 200 }}
										placeholder={CST.TH_PLACEHOLDER[0]}
										optionFilterProp="children"
										filterOption={(input, option) =>
											option.props.children
												? option.props.children
														.toString()
														.toLowerCase()
														.indexOf(input.toLowerCase()) >= 0
												: null
										}
									>
										{children}
									</Select>
									<SInput
										width="60%"
										className="bg-dark"
										value={this.state.targetCurrency}
										onChange={e =>
											this.handleTargetCurrencyInput(e.target.value)
										}
										onBlur={() => this.getDescription()}
										placeholder="{CST.TT_INPUT_AMOUNT[locale]}"
										right
									/>
								</li>
								<li className={'input-line'}>
									<Select
										showSearch
										style={{ width: 200 }}
										placeholder={CST.TH_PLACEHOLDER[1]}
										optionFilterProp="children"
										filterOption={(input, option) =>
											option.props.children
												? option.props.children
														.toString()
														.toLowerCase()
														.indexOf(input.toLowerCase()) >= 0
												: null
										}
									>
										{children}
									</Select>
									<SInput
										width="60%"
										className={''}
										value={this.state.baseCurrency}
										onChange={e => this.handleAmountInputChange(e.target.value)}
										onBlur={() => this.getDescription()}
										placeholder="{CST.TT_INPUT_AMOUNT[locale]}"
										right
									/>
								</li>
								<li className={'input-line'}>
									<span className="title" style={{ width: 200 }}>
										{CST.TH_PX}
									</span>
									<SInput
										width="60%"
										className={''}
										value={this.state.price}
										onChange={e => this.handlePriceInputChange(e.target.value)}
										onBlur={e => this.handlePriceInputChange(e.target.value)}
										placeholder="{CST.TT_INPUT_AMOUNT[locale]}"
										right
									/>
								</li>
								<li className={'input-line'}>
									<span className="title" style={{ width: 200 }}>
										{CST.TH_EXPIRE.toUpperCase()}
									</span>
									<TimePicker
										onChange={(time: Moment, timeString: string) =>
											this.handleExpireTime(time, timeString)
										}
										defaultValue={moment('8:00:00', 'HH:mm:ss')}
										style={{ width: 170 }}
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
												this.state.baseCurrency === '0' ||
												this.state.targetCurrency === '0'
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
