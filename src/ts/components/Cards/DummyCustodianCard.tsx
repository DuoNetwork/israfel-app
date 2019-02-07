import { Constants as WrapperConstants } from '@finbook/duo-contract-wrapper';
import { Icon } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { ColorStyles } from 'ts/common/styles';
import PriceChart from 'ts/components/Charts/PriceChart';
import { SDivFlexCenter } from '../_styled';
import { SButton, SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	type: string;
	margin: string;
}

export default class CustodianCard extends React.Component<IProps> {
	public render() {
		const { margin, type } = this.props;
		const isBeethoven = type === WrapperConstants.BEETHOVEN;
		const aLabel = '-';
		const bLabel = '-';
		return (
			<SCard
				title={
					<SCardTitle style={{ cursor: 'Pointer' }}>{type + ' Loading...'}</SCardTitle>
				}
				width="360px"
				margin={margin}
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
										<b>{'0' + CST.TH_ETH}</b>
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
						<SButton>{CST.TH_CONVERT}</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter
					horizontal
					padding="10px 5px 0 5px"
					style={{ color: ColorStyles.TextBlackAlpha, fontSize: 12 }}
				>
					<div className="cuscardtokenwrapper">
						<span style={{ display: 'flex', alignItems: 'center' }}>
							-<span className="aspan">{isBeethoven ? 'INCOME' : 'SHORT'}</span>
						</span>
						<span>{aLabel}</span>
					</div>
					<div className="cuscardnavtag">
						<span className="navspan">NAV</span>
						<span>
							<b>{'$ 0'}</b>
						</span>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="90px" padding="5px 0 15px 0">
					<div style={{ width: '56%' }}>
						<PriceChart prices={[]} timeOffset={7 * 3600} name={'-'} isA={true} />
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
								<b>-</b>
							</div>
							<div className="px-right">
								<b>-</b>
							</div>
						</div>
						<SButton>{CST.TH_TRADE}</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter
					horizontal
					padding="0 5px 0 5px"
					style={{ color: ColorStyles.TextBlackAlpha, fontSize: 12 }}
				>
					<div className="cuscardtokenwrapper">
						<span style={{ display: 'flex', alignItems: 'center' }}>
							-<span className="aspan">LONG</span>
						</span>
						<span>{bLabel}</span>
					</div>
					<div className="cuscardnavtag">
						<span className="navspan">NAV</span>
						<span>
							<b>{'$ 0'}</b>
						</span>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="80px" padding="5px 0 5px 0">
					<div style={{ width: '56%' }}>
						<PriceChart prices={[]} timeOffset={7 * 3600} name={'-'} isA={false} />
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
								<b>-</b>
							</div>
							<div className="px-right">
								<b>-</b>
							</div>
						</div>
						<SButton>{CST.TH_TRADE}</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal width="30%" padding="0">
					{[1, 3, 7].map(pct => (
						<SButton
							key={pct + ''}
							className={'range-picker ' + (pct === 7 ? '' : 'day-Button')}
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
