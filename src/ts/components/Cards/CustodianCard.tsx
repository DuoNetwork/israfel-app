import * as d3 from 'd3';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { duoWeb3Wrapper } from 'ts/common/duoWrapper';
import { IAcceptedPrice, ICustodianInfo, ITokenBalance } from 'ts/common/types';
import util from 'ts/common/util';
import PriceChart from 'ts/components/Charts/PriceChart';
import { SDivFlexCenter } from '../_styled';
import { SButton, SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	type: string;
	tokenBalances: { [code: string]: ITokenBalance };
	info: ICustodianInfo;
	margin: string;
	acceptedPrices: IAcceptedPrice[];
	handleConvert: (custodian: string, aToken: string, bToken: string) => void;
	handleTrade: (token: string) => void;
}

export default class CustodianCard extends React.Component<IProps> {
	public render() {
		const {
			type,
			info,
			margin,
			handleConvert,
			handleTrade,
			tokenBalances,
			acceptedPrices
		} = this.props;
		const contractCode = info.code;
		const tenor = info.states.maturity ? contractCode.split('-')[1] : CST.TENOR_PPT;
		const maturity = util.formatMaturity(info.states.maturity);
		const contractAddress = duoWeb3Wrapper.contractAddresses.Custodians[type][tenor];
		const aCode = contractAddress ? contractAddress.aToken.code : '';
		const bCode = contractAddress ? contractAddress.bToken.code : '';
		const lastAcceptedPrice = acceptedPrices.length
			? acceptedPrices[acceptedPrices.length - 1]
			: null;
		const aLabel =
			type === CST.BEETHOVEN
				? d3.format('.2%')(
						(info.states.periodCoupon * 365 * 24 * 3600000) / (info.states.period || 1)
				) + CST.TH_PA
				: d3.format('.2f')(
						lastAcceptedPrice
							? (lastAcceptedPrice.navA - 2) / lastAcceptedPrice.navA
							: 0
				) + CST.TH_X_LEV;
		const bLabel =
			d3.format('.2f')(
				lastAcceptedPrice
					? ((type === CST.BEETHOVEN ? 1 : 2) * info.states.alpha +
							lastAcceptedPrice.navB) /
							lastAcceptedPrice.navB
					: 0
			) + CST.TH_X_LEV;
		return (
			<SCard
				title={<SCardTitle>{type + ' ' + tenor}</SCardTitle>}
				width="360px"
				margin={margin}
			>
				<SDivFlexCenter horizontal>
					<SCardList noMargin width="66%">
						<div className="status-list-wrapper">
							<ul>
								<li>
									<span className="title">{CST.TH_MATURITY}</span>
									<span className="content">{maturity}</span>
								</li>
								<li>
									<span className="title">{CST.TH_COLLATERAL}</span>
									<span className="content">
										{util.formatBalance(info.states.ethCollateral) +
											' ' +
											CST.TH_ETH}
									</span>
								</li>
							</ul>
						</div>
					</SCardList>
					<div
						style={{
							width: '34%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '0px 10px'
						}}
					>
						<SButton
							onClick={() =>
								handleConvert(contractAddress.custodian.address, aCode, bCode)
							}
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
				<SDivFlexCenter horizontal height="130px" padding="10px 0">
					<div style={{ width: '66%', border: '1px solid rgba(237,241,242,1)' }}>
						<PriceChart
							prices={acceptedPrices}
							timeStep={6000}
							name={aCode}
							isA={true}
							label={aLabel}
						/>
					</div>
					<div
						style={{
							width: '34%',
							padding: '0px 10px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between'
						}}
					>
						<SCardList noMargin width="100%">
							<div className="status-list-wrapper">
								<ul>
									<li>
										<span className="title">{aCode}</span>
									</li>
									<li style={{ flexDirection: 'row-reverse' }}>
										<span className="content">
											{tokenBalances[aCode]
												? util.formatBalance(tokenBalances[aCode].balance)
												: 0}
										</span>
									</li>
								</ul>
							</div>
						</SCardList>
						<SButton onClick={() => handleTrade(aCode)}>
							{tokenBalances[aCode] && tokenBalances[aCode].balance
								? CST.TH_TRADE
								: CST.TH_GET}
						</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="130px" padding="10px 0">
					<div style={{ width: '66%', border: '1px solid rgba(237,241,242,1)' }}>
						<PriceChart
							prices={acceptedPrices}
							timeStep={6000}
							name={bCode}
							isA={false}
							label={bLabel}
						/>
					</div>
					<div
						style={{
							width: '34%',
							padding: '0px 10px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between'
						}}
					>
						<SCardList noMargin width="100%">
							<div className="status-list-wrapper">
								<ul>
									<li>
										<span className="title">{bCode}</span>
									</li>
									<li style={{ flexDirection: 'row-reverse' }}>
										<span className="content">
											{tokenBalances[bCode]
												? util.formatBalance(tokenBalances[bCode].balance)
												: 0}
										</span>
									</li>
								</ul>
							</div>
						</SCardList>
						<SButton onClick={() => handleTrade(bCode)}>
							{tokenBalances[bCode] && tokenBalances[bCode].balance
								? CST.TH_TRADE
								: CST.TH_GET}
						</SButton>
					</div>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
