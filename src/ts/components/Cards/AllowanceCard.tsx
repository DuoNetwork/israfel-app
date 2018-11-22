// import { Select } from 'antd';
// import { SelectValue } from 'antd/lib/select';
// import * as React from 'react';
// import * as CST from '../../common/constants';
// import web3Util from '../../common/web3Util';
// import { SDivFlexCenter } from '../_styled';
// import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput } from './_styled';

// interface IState {
// 	amount: string;
// 	tokenName: string;
// }

// export default class SetAllowanceCard extends React.Component<{}, IState> {
// 	constructor(props: object) {
// 		super(props);
// 		this.state = {
// 			amount: '',
// 			tokenName: CST.TOKEN_WETH
// 		};
// 	}

// 	private handleAmountInputChange = (value: string) =>
// 		this.setState({
// 			amount: value
// 		});

// 	private handleChangeToken(target: SelectValue) {
// 		this.setState({
// 			tokenName: target.toString()
// 		});
// 	}

// 	public render() {
// 		const Option = Select.Option;
// 		const children = CST.TH_CURRENCY.map(currency => (
// 			<Option key={currency}>{currency}</Option>
// 		));
// 		return (
// 			<SCard title={<SCardTitle>{'Allowance'}</SCardTitle>} width="370px" margin="0 0 0 5px">
// 				<SCardConversionForm>
// 					<SCardList>
// 						<div className="status-list-wrapper">
// 							<ul>
// 								<li>
// 									<Select
// 										showSearch
// 										style={{ width: 200 }}
// 										value={this.state.tokenName}
// 										onSelect={e => this.handleChangeToken(e)}
// 									>
// 										{children}
// 									</Select>
// 									<SInput
// 										width="60%"
// 										className="bg-dark"
// 										value={this.state.amount}
// 										onChange={e => this.handleAmountInputChange(e.target.value)}
// 										right
// 									/>
// 								</li>
// 								<li>
// 									<SDivFlexCenter
// 										horizontal
// 										width="100%"
// 										padding="0"
// 										marginTop="10px"
// 									>
// 										<button
// 											className={'form-button'}
// 											onClick={() => {
// 												if (!this.state.amount)
// 													web3Util.setUnlimitedTokenAllowance(
// 														this.state.tokenName
// 													);
// 												else {
// 													const tokenAddress = web3Util.getTokenAddressFromName(
// 														this.state.tokenName
// 													);
// 													web3Util.setProxyAllowance(
// 														tokenAddress,
// 														Number(this.state.amount)
// 													);
// 												}
// 											}}
// 										>
// 											{'Approve'}
// 										</button>
// 									</SDivFlexCenter>
// 								</li>
// 							</ul>
// 						</div>
// 					</SCardList>
// 				</SCardConversionForm>
// 			</SCard>
// 		);
// 	}
// }
