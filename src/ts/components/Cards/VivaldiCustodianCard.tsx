import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { IAcceptedPrice } from '@finbook/duo-market-data';
import { IOrderBookSnapshot } from '@finbook/israfel-common';
import { Icon, Tooltip } from 'antd';
import link from 'images/icons/link.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { duoWeb3Wrapper } from 'ts/common/duoWrapper';
import { ColorStyles } from 'ts/common/styles';
import { ITokenBalance, IVivaldiCustodianInfo } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SButton, SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	type: string;
	custodian: string;
	tokenBalances: { [code: string]: ITokenBalance };
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	info: IVivaldiCustodianInfo;
	margin: string;
	acceptedPrices: IAcceptedPrice[];
	ethPrice: number;
	handleConvert: (custodian: string, aToken: string, bToken: string) => void;
	handleTrade: (token: string) => void;
}

interface IState {
	timeOffset: number;
}

export default class CustodianCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			timeOffset: 7 * 3600
		};
	}

	private handleDayButtonClick(e: number) {
		this.setState({
			timeOffset: e
		});
	}

	public render() {
		const {
			type,
			info,
			margin,
			handleConvert,
			handleTrade,
			tokenBalances,
			orderBooks,
			ethPrice,
			custodian
		} = this.props;
		const { timeOffset } = this.state;
		const contractCode = info.code;
		const tenor = contractCode.substring(contractCode.indexOf('-') + 1);
		const contractAddress = duoWeb3Wrapper.contractAddresses.Custodians[type][tenor];
		const aCode = contractAddress ? contractAddress.aToken.code : '';
		const bCode = contractAddress ? contractAddress.bToken.code : '';
		const aOrderBook = orderBooks[aCode + '|' + CST.TH_WETH];
		const bOrderBook = orderBooks[bCode + '|' + CST.TH_WETH];
		const aBestBid =
			aOrderBook && aOrderBook.bids.length ? aOrderBook.bids[0].price * ethPrice : 0;
		const aBestAsk =
			aOrderBook && aOrderBook.asks.length ? aOrderBook.asks[0].price * ethPrice : 0;
		const bBestBid =
			bOrderBook && bOrderBook.bids.length ? bOrderBook.bids[0].price * ethPrice : 0;
		const bBestAsk =
			bOrderBook && bOrderBook.asks.length ? bOrderBook.asks[0].price * ethPrice : 0;
		const isTrading = info.states.state === WrapperConstants.CTD_TRADING;
		return (
			<SCard
				title={
					<SCardTitle>
						{type + ' ' + tenor}
						<img
							className="cus-link"
							src={link}
							style={{ width: '14px', marginLeft: '10px' }}
							onClick={() =>
								window.open(util.getEtherScanAddressLink(custodian), '_blank')
							}
						/>
					</SCardTitle>
				}
				width="360px"
				margin={margin}
				extra={
					<div className="cus-addr-button">
						<Tooltip
							title={`Custodian is in ${info.states.state} state`}
							placement="left"
						>
							<div className="status-ligh-wrapper">
								<div
									className={
										'status-light ' + (isTrading ? 'status3' : 'status2')
									}
								/>
							</div>
						</Tooltip>
					</div>
				}
			>
				<SDivFlexCenter horizontal>
					<SCardList noLiBorder noUlBorder noMargin width="56%">
						<div className="status-list-wrapper">
							<ul>
								<li>
									<span
										className="title"
										style={{ display: 'flex', alignItems: 'center' }}
									>
										{CST.TH_ETH}
									</span>
									<span
										className="title"
										style={{
											display: 'flex',
											alignItems: 'center',
											transform: 'scaleX(1.5)'
										}}
									>
										<Icon type="swap" />
									</span>
									<span className="content">
										<div className="cus-des">
											<div>In Token</div>
											<div>Out Token</div>
										</div>
									</span>
								</li>
								<li style={{ justifyContent: 'start' }}>
									<span className="title" style={{ fontSize: 10 }}>
										Fully backed by
									</span>
									<span
										className="content"
										style={{ fontSize: 10, marginLeft: 4 }}
									>
										<b>
											{util.formatBalance(info.states.collateral) +
												' ' +
												CST.TH_ETH}
										</b>
									</span>
								</li>
							</ul>
						</div>
					</SCardList>
					<div
						style={{
							width: '44%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '0 0 0 10px'
						}}
					>
						<SButton
							onClick={() =>
								handleConvert(contractAddress.custodian.address, aCode, bCode)
							}
							disable={!isTrading}
						>
							{tokenBalances[aCode] &&
							tokenBalances[bCode] &&
							tokenBalances[aCode].balance &&
							tokenBalances[bCode].balance
								? CST.TH_CONVERT
								: CST.TH_GET_BOTH}
						</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter
					horizontal
					padding="10px 5px 0 5px"
					style={{ color: ColorStyles.TextBlackAlpha, fontSize: 12 }}
				>
					<div className="cuscardtokenwrapper">
						<span style={{ display: 'flex', alignItems: 'center' }}>
							{aCode}
							<span className="aspan">IN</span>
						</span>
					</div>
					<div className="cuscardnavtag">
						<span className="navspan">NAV</span>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="90px" padding="5px 0 15px 0">
					<div style={{ width: '56%' }}>
						<div>
							Round End:{' '}
							{util.formatMaturity(info.states.resetPriceTime + info.states.period)}
						</div>
						<div>Last Round: {info.states.isKnockedIn ? 'In' : 'Out'}</div>
					</div>
					<div
						style={{
							width: '44%',
							padding: '5px 0 0 10px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between'
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div className="px-left">
								<b>{aBestBid ? '$' + util.formatPriceShort(aBestBid) : '-'}</b>
							</div>
							<div className="px-right">
								<b>{aBestAsk ? '$' + util.formatPriceShort(aBestAsk) : '-'}</b>
							</div>
						</div>
						<SButton onClick={() => handleTrade(aCode)} disable={!isTrading}>
							{tokenBalances[aCode] && tokenBalances[aCode].balance
								? CST.TH_TRADE
								: CST.TH_GET}
						</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter
					horizontal
					padding="0 5px 0 5px"
					style={{ color: ColorStyles.TextBlackAlpha, fontSize: 12 }}
				>
					<div className="cuscardtokenwrapper">
						<span style={{ display: 'flex', alignItems: 'center' }}>
							{bCode}
							<span className="aspan">OUT</span>
						</span>
					</div>
					<div className="cuscardnavtag">
						<span className="navspan">MID</span>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="80px" padding="5px 0 5px 0">
					<div style={{ width: '56%' }}>
						<div>Current Strike: {info.states.roundStrike}</div>
					</div>
					<div
						style={{
							width: '44%',
							padding: '5px 0 0 10px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between'
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div className="px-left">
								<b>{bBestBid ? '$' + util.formatPriceShort(bBestBid) : '-'}</b>
							</div>
							<div className="px-right">
								<b>{bBestAsk ? '$' + util.formatPriceShort(bBestAsk) : '-'}</b>
							</div>
						</div>
						<SButton onClick={() => handleTrade(bCode)} disable={!isTrading}>
							{tokenBalances[bCode] && tokenBalances[bCode].balance
								? CST.TH_TRADE
								: CST.TH_GET}
						</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal width="30%" padding="0">
					{[1, 3, 7].map(pct => (
						<SButton
							key={pct + ''}
							className={
								'range-picker ' + (timeOffset === 3600 * pct ? '' : 'day-Button')
							}
							onClick={() => this.handleDayButtonClick(3600 * pct)}
							style={{ border: 'none' }}
						>
							{pct === 1 ? '24H' : pct + 'D'}
						</SButton>
					))}
				</SDivFlexCenter>
			</SCard>
		);
	}
}
