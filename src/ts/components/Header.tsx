import duoIcon from 'images/DUO_icon.png';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as CST from 'ts/common/constants';
import util from 'ts/common/util';
import { SDivFlexCenter, SHeader } from './_styled';
//import LocaleSelect from './Common/LocaleSelect';

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
		console.log(exPx);
		return (
			<SHeader>
				<SDivFlexCenter horizontal width={'1200px'} height={'60px'}>
					<div style={{ display: 'flex' }}>
						<Link to={'/'}>
							<div className="icon-wrapper">
								<img src={duoIcon} />
							</div>
						</Link>
						<div className="nav-bal-wrapper">
							{network ? (
								(__KOVAN__ && network !== CST.NETWORK_ID_KOVAN) ||
								(!__KOVAN__ && network !== CST.NETWORK_ID_MAIN) ? (
									<span className="error-msg">
										{CST.TT_NETWORK_CHECK[locale]}
									</span>
								) : (
									exPx.map(ex => (
										<div className="nav-bal-item">
											<div key={ex.exchange}>{ex.exchange}</div>
											<div key={ex.price} className="nav-bal-value">
												{util.formatPriceShort(ex.price)}
											</div>
										</div>
									))
								)
							) : null}
						</div>
					</div>
					{/* {network ? (
						(__KOVAN__ && network !== CST.NETWORK_ID_KOVAN) ||
						(!__KOVAN__ && network !== CST.NETWORK_ID_MAIN) ? (
							<span className="error-msg">{CST.TT_NETWORK_CHECK[locale]}</span>
						) : (
							JSON.stringify(exchangePrices)
						)
					) : null} */}
					<SDivFlexCenter horizontal>
						<div className="nav-button-wrapper">{CST.DB_ORDERS.toUpperCase()}</div>
						<div className="nav-button-wrapper">
							<Link to={'/status'}>{CST.TH_STATUS.toUpperCase()}</Link>
						</div>
						{/* <LocaleSelect locale={locale} onSelect={updateLocale} /> */}
					</SDivFlexCenter>
				</SDivFlexCenter>
			</SHeader>
		);
	}
}
