import link from 'images/icons/linkBlack.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { ColorStyles } from 'ts/common/styles';
import { IEthBalance, INotification } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle, SInput } from './_styled';
import { SButton } from './_styled';

interface IProps {
	visible: boolean;
	account: string;
	ethBalance: IEthBalance;
	tokenBalances: Array<{ code: string; balance: number; address: string }>;
	totalNav: number;
	notify: (notification: INotification) => any;
	handleClose: () => void;
	wrapEther: (amount: number, address: string) => Promise<string>;
	unwrapEther: (amount: number, address: string) => Promise<string>;
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
		const { notify, wrapEther, account } = this.props;
		const { ethInput } = this.state;

		if (ethInput.match(CST.RX_NUM_P)) {
			notify({
				level: 'info',
				title: CST.TH_ETH,
				message: 'Please check your MetaMask!',
				transactionHash: ''
			});
			wrapEther(Number(ethInput), account).then(txHash => {
				this.setState({ ethInput: '' });
				notify({
					level: 'info',
					title: 'WETH',
					message: 'Wrap transacton sent.',
					transactionHash: txHash
				});
			});
		} else this.setState({ ethInput: '' });
	};

	private handleUnwrap = () => {
		const { notify, unwrapEther, account } = this.props;
		const { wethInput } = this.state;
		if (wethInput.match(CST.RX_NUM_P)) {
			notify({
				level: 'info',
				title: CST.TH_WETH,
				message: 'Please check your MetaMask!',
				transactionHash: ''
			});
			unwrapEther(Number(wethInput), account).then(txHash => {
				this.setState({ wethInput: '' });
				notify({
					level: 'info',
					title: 'WETH',
					message: 'Unwrap transacton sent.',
					transactionHash: txHash
				});
			});
		} else this.setState({ wethInput: '' });
	};

	public render() {
		const { account, handleClose, visible, ethBalance, tokenBalances, totalNav } = this.props;
		const { ethInput, wethInput } = this.state;
		const animated = visible ? 'animated' : '';

		return (
			<SCard
				title={<SCardTitle>{CST.TH_BALANCES} </SCardTitle>}
				className={'panel-wrap ' + animated}
				style={{ right: visible ? 0 : -200 }}
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
						placeholder="Amount"
						width="60%"
						style={{ height: '30px' }}
						value={ethInput}
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
						placeholder="Amount"
						width="60%"
						style={{ height: '30px' }}
						value={wethInput}
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
								{tokenBalances.map(tb => (
									<li key={tb.code} style={{ padding: '5px 5px' }}>
										<span className="title">{tb.code}</span>
										<span className="content">
											{tb.balance ? util.formatBalance(tb.balance) : '-'}
											<img
												className="cus-link"
												src={link}
												style={{
													width: '14px',
													height: '14px',
													marginLeft: '10px'
												}}
												onClick={() =>
													window.open(
														util.getEtherScanTokenLink(
															tb.address,
															account
														),
														'__blank'
													)
												}
											/>
										</span>
									</li>
								))}
							</ul>
						</div>
					</SCardList>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
					<SCardList noMargin>
						<div className="status-list-wrapper">
							<ul>
								<li style={{ padding: '5px 5px' }}>
									<span className="title">{CST.TH_TOTAL + ' ' + CST.TH_NAV}</span>
									<span className="content">
										<img
											className="cus-link"
											src={link}
											style={{
												width: '12px',
												height: '12px',
												marginLeft: '10px'
											}}
											onClick={() =>
												window.open(
													util.getEtherScanAddressLink(account),
													'__blank'
												)
											}
										/>
									</span>
								</li>
								<li style={{ padding: '5px 5px', flexDirection: 'row-reverse' }}>
									<span className="content">
										{'$' + util.formatBalance(totalNav)}
									</span>
								</li>
							</ul>
						</div>
					</SCardList>
				</SDivFlexCenter>
				<SButton
					className="rightFixed"
					onClick={handleClose}
					style={{
						background: visible ? '#fff' : ColorStyles.MainColor,
						color: visible ? ColorStyles.MainColor : '#fff'
					}}
				>
					{(visible ? '∧  ' + CST.TH_HIDE : '∨  ' + CST.TH_SHOW) + ' ' + CST.TH_BALANCES}
				</SButton>
			</SCard>
		);
	}
}
