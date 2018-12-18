// import { Table } from 'antd';
// import close from 'images/icons/close.svg';
// import ethIcon from 'images/ethIcon.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
// import { IStatus } from 'ts/common/types';
// import util from 'ts/common/util';
import { IEthBalance } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle, SInput } from './_styled';
import { SButton } from './_styled';
interface IProps {
	handleClick: () => void;
	visible: boolean;
	ethBalance: IEthBalance;
}
interface IState {
	eth: number;
	weth: number;
}

export default class BalancePopUpCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			eth: 0,
			weth: 0
		};
	}

	private handleETHInputChange(eth: number) {
		this.setState({
			eth: eth
		});
	}

	private handleWETHInputChange(weth: number) {
		this.setState({
			weth: weth
		});
	}

	private handleWard() {
		console.log('WARD');
	}

	public render() {
		const { handleClick, visible, ethBalance } = this.props;
		// const { visible } = this.state;
		console.log(visible);
		const animated = visible ? 'animated' : '';
		// const visibleLayer = visible ? 'block' : 'none';

		return (
			<div>
				{visible ? (
					<SCard
						title={
							<SCardTitle style={{ textAlign: 'center' }}>
								{CST.TH_BALANCE.toUpperCase()}{' '}
							</SCardTitle>
						}
						className={'panel-wrap ' + animated}
					>
						<SCardList noMargin width="100%">
							<div className="status-list-wrapper">
								<ul>
									<li className="block-title" style={{ padding: '5px 15px' }}>
										{CST.TH_TOTAL_ASSET}
									</li>
									<li style={{ padding: '5px 5px' }}>
										<span className="title">{/* <img src={ethIcon} /> */}</span>
										<span className="content">
											{util.formatBalance(ethBalance.eth)}
										</span>
									</li>
								</ul>
							</div>
						</SCardList>
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
								value={this.state.eth}
								onChange={e => this.handleETHInputChange(Number(e.target.value))}
							/>
							<SButton onClick={this.handleWard} width="40%">
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
								value={this.state.weth}
								onChange={e => this.handleWETHInputChange(Number(e.target.value))}
							/>
							<SButton onClick={this.handleWard} width="40%">
								{CST.TH_UNWRAP}
							</SButton>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">aETH</span>
											<span className="content">xxx</span>
										</li>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">bETH</span>
											<span className="content">xxx</span>
										</li>
									</ul>
								</div>
							</SCardList>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">aETH-M19</span>
											<span className="content">xxx</span>
										</li>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">bETH-M19</span>
											<span className="content">xxx</span>
										</li>
									</ul>
								</div>
							</SCardList>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">aETH</span>
											<span className="content">xxx</span>
										</li>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">bETH</span>
											<span className="content">xxx</span>
										</li>
									</ul>
								</div>
							</SCardList>
						</SDivFlexCenter>
						<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
							<SCardList noMargin>
								<div className="status-list-wrapper">
									<ul>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">aETH</span>
											<span className="content">xxx</span>
										</li>
										<li style={{ padding: '5px 5px' }}>
											<span className="title">bETH</span>
											<span className="content">xxx</span>
										</li>
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
						onClick={() => handleClick()}
					>
						{visible ? CST.TH_CLOSE_BALANCE : CST.TH_OPEN_BALANCE}
					</SButton>
				</div>
			</div>
		);
	}
}
