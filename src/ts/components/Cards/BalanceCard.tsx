import { notification } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IEthBalance, IToken, ITokenBalance } from 'ts/common/types';
import util from 'ts/common/util';
import web3Util from 'ts/common/web3Util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle, SInput } from './_styled';
import { SButton } from './_styled';

const openNotification = (type: string, tx: string) => {
	let args = {};
	if (type === 'error')
		args = {
			message: type.toUpperCase(),
			description: tx,
			duration: 0
		};
	else {
		const btn = (
			<SButton
				onClick={() =>
					window.open(
						`https://${__KOVAN__ ? 'kovan.' : ''}etherscan.io/tx/${tx}`,
						'_blank'
					)
				}
			>
				View Transaction on Etherscan
			</SButton>
		);
		args = {
			message: 'Transaction Sent',
			description: 'Transaction hash: ' + tx,
			duration: 0,
			btn
		};
	}
	notification.open(args as any);
};

interface IProps {
	visible: boolean;
	account: string;
	ethBalance: IEthBalance;
	tokens: IToken[];
	custodianTokenBalances: { [custodian: string]: { [code: string]: ITokenBalance } };
	handleClose: () => void;
}

interface IState {
	ethInput: string;
	wethInput: string;
}

export default class BalanceCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			ethInput: '',
			wethInput: ''
		};
	}

	private handleETHInputChange = (value: string) =>
		this.setState({
			ethInput: value
		});

	private handleWETHInputChange = (value: string) =>
		this.setState({
			wethInput: value
		});

	private handleWrap = () => {
		const { ethInput } = this.state;
		if (ethInput.match(CST.RX_NUM_P))
			web3Util.wrapEther(Number(ethInput), this.props.account).then(txHash => {
				this.setState({ ethInput: '' });
				openNotification('info', txHash);
			});
		else this.setState({ ethInput: '' });
	};

	private handleUnwrap = () => {
		const { wethInput } = this.state;
		if (wethInput.match(CST.RX_NUM_P))
			web3Util.unwrapEther(Number(wethInput), this.props.account).then(txHash => {
				this.setState({ wethInput: '' });
				openNotification('info', txHash);
			});
		else this.setState({ wethInput: '' });
	};

	public render() {
		const { handleClose, visible, ethBalance, custodianTokenBalances } = this.props;
		const animated = visible ? 'animated' : '';

		const tokens = [...this.props.tokens];
		tokens.sort((a, b) => a.code.localeCompare(b.code));

		return (
			<div>
				{visible ? (
					<SCard
						title={
							<SCardTitle style={{ textAlign: 'center' }}>
								{CST.TH_BALANCES.toUpperCase()}{' '}
							</SCardTitle>
						}
						className={'panel-wrap ' + animated}
					>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">{CST.TH_ETH}</span>
											<span className="content">
												{util.formatBalance(ethBalance.eth)}
											</span>
										</li>
									</ul>
								</div>
							</SCardList>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal width="100%">
							<SInput
								right
								width="60%"
								style={{ height: '30px' }}
								value={this.state.ethInput}
								onChange={e => this.handleETHInputChange(e.target.value)}
							/>
							<SButton onClick={this.handleWrap} width="40%">
								{CST.TH_WRAP}
							</SButton>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">{CST.TH_WETH}</span>
											<span className="content">
												{util.formatBalance(ethBalance.weth)}
											</span>
										</li>
									</ul>
								</div>
							</SCardList>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal width="100%">
							<SInput
								right
								width="60%"
								style={{ height: '30px' }}
								value={this.state.wethInput}
								onChange={e => this.handleWETHInputChange(e.target.value)}
							/>
							<SButton onClick={this.handleUnwrap} width="40%">
								{CST.TH_UNWRAP}
							</SButton>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										{tokens.map(token => (
											<li key={token.code} style={{ padding: '5px 5px' }}>
												<span className="title">{token.code}</span>
												<span className="content">
													{custodianTokenBalances[token.custodian] &&
													custodianTokenBalances[token.custodian][
														token.code
													]
														? util.formatBalance(
																custodianTokenBalances[
																	token.custodian
																][token.code].balance
														)
														: '-'}
												</span>
											</li>
										))}
									</ul>
								</div>
							</SCardList>
						</SDivFlexCenter>
					</SCard>
				) : null}
				<div>
					<SButton
						className="rightFixed"
						style={{ right: visible ? '60px' : '-135px' }}
						onClick={handleClose}
					>
						{(visible ? CST.TH_HIDE : CST.TH_SHOW) + ' ' + CST.TH_BALANCES}
					</SButton>
				</div>
			</div>
		);
	}
}
