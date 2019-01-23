import { Icon, Tooltip } from 'antd';
import * as d3 from 'd3';
import link from 'images/icons/link.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { duoWeb3Wrapper, getTokenInterestOrLeverage } from 'ts/common/duoWrapper';
import { ColorStyles } from 'ts/common/styles';
import { IAcceptedPrice, ICustodianInfo, IOrderBookSnapshot, ITokenBalance } from 'ts/common/types';
import util from 'ts/common/util';
import PriceChart from 'ts/components/Charts/PriceChart';
import { SDivFlexCenter } from '../_styled';
import { SButton, SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	type: string;
	custodian: string;
	tokenBalances: { [code: string]: ITokenBalance };
	orderBooks: { [pair: string]: IOrderBookSnapshot };
	info: ICustodianInfo;
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
			acceptedPrices,
			orderBooks,
			ethPrice,
			custodian
		} = this.props;
		const { timeOffset } = this.state;
		const contractCode = info.code;
		const tenor = info.states.maturity ? contractCode.split('-')[1] : CST.TENOR_PPT;
		const contractAddress = duoWeb3Wrapper.contractAddresses.Custodians[type][tenor];
		const aCode = contractAddress ? contractAddress.aToken.code : '';
		const bCode = contractAddress ? contractAddress.bToken.code : '';
		const isBeethoven = type === CST.BEETHOVEN;
		const aNumber = d3.format(isBeethoven ? '.2%' : '.2f')(
			getTokenInterestOrLeverage(info.states, isBeethoven, true)
		);
		const aLabel = aNumber + (isBeethoven ? CST.TH_PA : 'x');
		const aDescription =
			aCode +
			' holders ' +
			(aNumber.startsWith('-') ? ' is shorting ' : 'receiving payments at ') +
			aNumber +
			(aNumber.startsWith('-') ? ' leverage' : ' per annum.');
		const bLabel =
			d3.format('.2f')(getTokenInterestOrLeverage(info.states, isBeethoven, false)) + 'x';
		const bDescription =
			bCode +
			' holders are' +
			(Number(getTokenInterestOrLeverage(info.states, isBeethoven, false)) > 0
				? ' longing '
				: ' shorting ') +
			bLabel +
			' leverage.';
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
		const isTrading = info.states.state === CST.CTD_TRADING;
		const isNearReset =
			info.states.navB - info.states.limitLower < 0.1 ||
			info.states.limitUpper - info.states.navB < 0.1;
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
										'status-light ' +
										(isNearReset
											? 'status1'
											: info.states.state === 'Trading'
											? 'status3'
											: 'status2')
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
										{isBeethoven ? (
											<div className="cus-des">
												<div>Income Token</div>
												<div>Leverage Token</div>
											</div>
										) : (
											<div className="cus-des">
												<div>Short Token</div>
												<div>Long Token</div>
											</div>
										)}
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
											{util.formatBalance(info.states.ethCollateral) +
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
							<span className="aspan">{isBeethoven ? 'INCOME' : 'SHORT'}</span>
						</span>
						<Tooltip title={aDescription} placement="top">
							<span>{aLabel}</span>
						</Tooltip>
					</div>
					<div className="cuscardnavtag">
						<span className="navspan">NAV</span>
						<span>
							<b>{'$' + (info ? util.formatPriceShort(info.states.navA) : 0)}</b>
						</span>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="90px" padding="5px 0 15px 0">
					<div style={{ width: '56%' }}>
						<PriceChart
							prices={acceptedPrices}
							timeOffset={timeOffset}
							name={aCode}
							isA={true}
						/>
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
							<span className="aspan">{isBeethoven ? 'LEVERAGE' : 'LONG'}</span>
						</span>
						<Tooltip title={bDescription} placement="top">
							<span>{bLabel}</span>
						</Tooltip>
					</div>
					<div className="cuscardnavtag">
						<span className="navspan">NAV</span>
						<span>
							<b>{'$' + (info ? util.formatPriceShort(info.states.navB) : 0)}</b>
						</span>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="80px" padding="5px 0 5px 0">
					<div style={{ width: '56%' }}>
						<PriceChart
							prices={acceptedPrices}
							timeOffset={timeOffset}
							name={bCode}
							isA={false}
						/>
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
