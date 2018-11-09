import * as React from 'react';
import * as CST from '../../common/constants';
import web3Util from '../../common/web3Util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardConversionForm, SCardList, SCardTitle, SInput } from './_styled';

interface IState {
	amount: string;
}

export default class SetAllowanceCard extends React.PureComponent<{}, IState> {
	constructor(props: object) {
		super(props);
		this.state = {
			amount: ''
		};
	}

	private handleAmountInputChange = (value: string) =>
		this.setState({
			amount: value
		});

	public render() {
		return (
			<SCard title={<SCardTitle>{'Allowance'}</SCardTitle>} width="370px" margin="0 0 0 5px">
				<SCardConversionForm>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className={'input-line'}>
									<span className="title" style={{ width: 200 }}>
										{CST.TH_AMT}
									</span>
									<SInput
										width="60%"
										className={''}
										value={this.state.amount}
										onChange={e => this.handleAmountInputChange(e.target.value)}
										placeholder={CST.TH_AMT}
										right
									/>
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
											// disabled={!Number(this.state.amount)}
											onClick={() =>
												web3Util.setUnlimitedTokenAllowance(CST.TOKEN_WETH)
											}
										>
											{'Approve'}
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