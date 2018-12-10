import * as React from 'react';
import * as CST from 'ts/common/constants';
import PriceChart from 'ts/components/Charts/PriceChart';
import { IAcceptedPrice } from '../../../../../duo-admin/src/common/types';
import temp from '../../../images/temp.png';
import { SDivFlexCenter } from '../_styled';
import { SButton, SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	title: string;
	margin: string;
	acceptedPrices: IAcceptedPrice[];
	toggleConvertDisplay: () => void;
	toggleTradeDisplay: () => void;
}

export default class Contract2in1Card extends React.Component<IProps> {
	public render() {
		const { title, margin, toggleConvertDisplay, toggleTradeDisplay } = this.props;
		return (
			<SCard
				title={<SCardTitle>{title.toUpperCase()}</SCardTitle>}
				width="595px"
				margin={margin}
			>
				<SDivFlexCenter horizontal>
					<SCardList noMargin width="66%">
						<div className="status-list-wrapper">
							<ul>
								<li>
									<span className="title">{CST.TH_EXPIRY}</span>
									<span className="content">2018-12-12 12:05</span>
								</li>
								<li>
									<span className="title">{CST.TH_COLLATERAL}</span>
									<span className="content">1,234,567</span>
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
							{CST.TH_CONVERT.toUpperCase()}
						</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="130px" padding="10px 0">
					<div style={{ width: '66%', border: '1px solid rgba(237,241,242,1)' }}>
						<img src={temp} style={{ width: '100%', height: '100%' }} />
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
										<span className="title">aETH</span>
									</li>
									<li style={{ flexDirection: 'row-reverse' }}>
										<span className="content">1,234,567</span>
									</li>
								</ul>
							</div>
						</SCardList>
						<SButton onClick={toggleTradeDisplay}>TRADE aETH</SButton>
					</div>
				</SDivFlexCenter>
				<SDivFlexCenter horizontal height="130px" padding="10px 0">
					<div style={{ width: '66%', border: '1px solid rgba(237,241,242,1)' }}>
						<PriceChart prices={this.props.acceptedPrices} timeStep={6000} />
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
										<span className="title">bETH</span>
									</li>
									<li style={{ flexDirection: 'row-reverse' }}>
										<span className="content">1,234,567</span>
									</li>
								</ul>
							</div>
						</SCardList>
						<SButton onClick={toggleTradeDisplay}>TRADE bETH</SButton>
					</div>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
