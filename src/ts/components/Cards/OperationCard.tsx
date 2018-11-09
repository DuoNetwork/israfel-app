import { Select } from 'antd';
import { DatePicker } from 'antd';
import { TimePicker } from 'antd';
import { SelectValue } from 'antd/lib/select';
import moment, { Moment } from 'moment';
import * as React from 'react';
import * as CST from '../../common/constants';
import util from '../../common/util';
import wsUtil from '../../common/wsUtil';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput } from './_styled';

interface IState {
	isCreate: boolean;
	baseCurrency: string;
	description: string;
	price: string;
	targetCurrency: string;
	expireDate: number;
	expireTime: string;
	base: string;
	target: string;
}

export default class OperationCard extends React.PureComponent<{}, IState> {
	constructor(props: object) {
		super(props);
		this.state = {
			isCreate: true,
			baseCurrency: '',
			description: '',
			expireDate: moment(moment().startOf('day'))
				.add(1, 'day')
				.valueOf(),
			expireTime: '00:00:00',
			targetCurrency: '',
			price: '',
			base: CST.TH_PLACEHOLDER[1],
			target: CST.TH_PLACEHOLDER[0]
		};
	}

	private handleTypeChange = () =>
		this.setState({
			isCreate: !this.state.isCreate,
			baseCurrency: '',
			targetCurrency: '',
			description: '',
			expireDate: moment(util.getUTCNowTimestamp())
				.add(1, 'day')
				.valueOf(),
			expireTime: '00:00:00',
			price: '',
			base: CST.TH_PLACEHOLDER[1],
			target: CST.TH_PLACEHOLDER[0]
		});

	private submit = async () => {
		const action = this.state.isCreate ? 'Sell' : 'Buy';
		await wsUtil.addOrder(
			Number(this.state.targetCurrency),
			Number(this.state.baseCurrency),
			action === 'Buy',
			Math.ceil(this.state.expireDate / 1000) + util.convertSecond(this.state.expireTime)
		);
	};

	private getDescription = () => {
		const { isCreate, targetCurrency, baseCurrency } = this.state;
		if (targetCurrency > '0' && baseCurrency > '0')
			this.setState({
				price: (Number(targetCurrency) / Number(baseCurrency)).toString()
			});
		else this.setState({ price: '' });

		this.setState({
			description: !isCreate
				? 'Buy ' + targetCurrency + ' with ' + baseCurrency
				: 'Sell ' + baseCurrency + ' for ' + targetCurrency
		});
	};

	private handleChangeBase(base: SelectValue) {
		this.setState({
			base: base.toString()
		});
	}

	private handleChangeTarget(target: SelectValue) {
		this.setState({
			target: target.toString()
		});
	}

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
		this.setState({ price: price });
	};

	private handleTargetCurrencyInput = (targetCurrency: string) => {
		this.setState({ targetCurrency: targetCurrency });
	};

	private handleExpireDate(time: number) {
		this.setState({
			expireDate: time.valueOf()
		});
	}

	private handleExpireTime(time: Moment, timeString: string) {
		this.setState({ expireTime: timeString });
		console.log(time.toString());
	}

	private handleClear = () =>
		this.setState({
			baseCurrency: '',
			targetCurrency: '',
			description: '',
			price: '',
			base: CST.TH_PLACEHOLDER[1],
			target: CST.TH_PLACEHOLDER[0],
			expireDate: moment(moment().startOf('day'))
				.add(1, 'day')
				.valueOf(),
			expireTime: '00:00:00'
		});

	public render() {
		const Option = Select.Option;
		const children = CST.TH_CURRENCY.map(currency => (
			<Option key={currency}>{currency}</Option>
		));
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
										value={this.state.target}
										onSelect={e => this.handleChangeTarget(e)}
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
										placeholder={CST.TH_PLACEHOLDER[0]}
										right
									/>
								</li>
								<li className={'input-line'}>
									<Select
										showSearch
										style={{ width: 200 }}
										value={this.state.base}
										onSelect={(e: SelectValue) => this.handleChangeBase(e)}
									>
										{children}
									</Select>
									<SInput
										width="60%"
										className={''}
										value={this.state.baseCurrency}
										onChange={e => this.handleAmountInputChange(e.target.value)}
										onBlur={() => this.getDescription()}
										placeholder={CST.TH_PLACEHOLDER[1]}
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
										onBlur={() => this.getDescription()}
										placeholder={CST.TH_PX}
										right
									/>
								</li>
								<li className={'input-line'}>
									<span className="title" style={{ width: 200 }}>
										{CST.TH_EXPIRE.toUpperCase()}
									</span>
									<DatePicker
										value={moment(this.state.expireDate)}
										onChange={time => this.handleExpireDate(time.valueOf())}
										style={{ width: 170 }}
									/>
									<TimePicker
										onChange={(time: Moment, timeString: string) =>
											this.handleExpireTime(time, timeString)
										}
										value={moment(this.state.expireTime, 'HH:mm:ss')}
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
