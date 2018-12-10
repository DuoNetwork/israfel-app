import moment from 'moment';
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
	toggleConvertDisplay: () => void;
	toggleTradeDisplay: () => void;
}

export default class CustodianCard extends React.Component<IProps> {
	public render() {
		const {
			type,
			info,
			margin,
			toggleConvertDisplay,
			toggleTradeDisplay,
			tokenBalances
		} = this.props;
		const contractCode = info.code;
		const tenor = info.states.maturity ? contractCode.split('-')[1] : CST.TENOR_PPT;
		const maturity = info.states.maturity
			? moment(info.states.maturity).format('YYYY-MM-DD HH:mm')
			: CST.TH_PERPETUAL;
		const contractAddress = duoWeb3Wrapper.contractAddresses.Custodians[type][tenor];
		const aCode = contractAddress ? contractAddress.aToken.code : '';
		const bCode = contractAddress ? contractAddress.bToken.code : '';
		return (
			<SCard
				title={<SCardTitle>{type + ' ' + tenor}</SCardTitle>}
				width="595px"
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
						<SButton onClick={toggleConvertDisplay}>
							{CST.TH_CONVERT}
						</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="130px" padding="10px 0">
					<div style={{ width: '66%', border: '1px solid rgba(237,241,242,1)' }}>
						<PriceChart
							prices={this.props.acceptedPrices}
							timeStep={6000}
							name={aCode}
							isA={true}
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
						<SButton onClick={toggleTradeDisplay}>{CST.TH_TRADE + ' ' + aCode}</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="130px" padding="10px 0">
					<div style={{ width: '66%', border: '1px solid rgba(237,241,242,1)' }}>
						<PriceChart
							prices={this.props.acceptedPrices}
							timeStep={6000}
							name={bCode}
							isA={false}
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
						<SButton onClick={toggleTradeDisplay}>{CST.TH_TRADE + ' ' + bCode}</SButton>
					</div>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
