import duoIcon from 'images/DUO_icon.png';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as CST from 'ts/common/constants';
import util from 'ts/common/util';
import { SDivFlexCenter, SHeader } from './_styled';

export interface IProps {
	network: number;
	locale: string;
	exchangePrices: { [source: string]: number };
	updateLocale: (locale: string) => any;
}

export default class Header extends React.Component<IProps> {
	public render() {
		const { network, exchangePrices } = this.props;
		const locale = this.props.locale || CST.LOCALE_EN;
		const exPx = [];
		for (const key in exchangePrices) exPx.push({ exchange: key, price: exchangePrices[key] });
		return (
			<SHeader>
				<SDivFlexCenter horizontal width={'1200px'} height={'60px'}>
					<div style={{ display: 'flex' }}>
						<Link to={'/'}>
							<div className="icon-wrapper">
								<img src={duoIcon} />
							</div>
						</Link>
						<div>
							{network ? (
								(__ENV__ !== CST.DB_LIVE && network !== CST.NETWORK_ID_KOVAN) ||
								(__ENV__ === CST.DB_LIVE && network !== CST.NETWORK_ID_MAIN) ? (
									<span className="error-msg">
										{CST.TT_NETWORK_CHECK[locale]}
									</span>
								) : (
									<div className="nav-bal-wrapper">
										<span style={{ marginRight: 18 }}>ETH/USD</span>
										{exPx.map(ex => (
											<div key={ex.exchange} className="nav-bal-item">
												<div>{ex.exchange.toUpperCase()}</div>
												<div className="nav-bal-value">
													{util.formatNumber(ex.price)}
												</div>
											</div>
										))}
									</div>
								)
							) : null}
						</div>
					</div>
					<SDivFlexCenter horizontal>
						<div className="nav-button-wrapper">
							{/* <Link to={''}>{CST.TH_TUTORIAL.toUpperCase()}</Link> */}
						</div>
						<div className="nav-button-wrapper">
							<div
								style={{ background: 'transparent', cursor: 'pointer' }}
								onClick={() => window.open('https://help.duo.network')}
							>
								{CST.TH_SUPPORT.toUpperCase()}
							</div>
						</div>
						<div className="nav-button-wrapper">
							<Link to={'/status'}>{CST.TH_STATUS.toUpperCase()}</Link>
						</div>
					</SDivFlexCenter>
				</SDivFlexCenter>
			</SHeader>
		);
	}
}
