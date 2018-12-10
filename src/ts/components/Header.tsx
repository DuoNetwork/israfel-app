import duoIcon from 'images/DUO_icon.png';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as CST from 'ts/common/constants';
import { IEthBalance } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter, SHeader } from './_styled';
//import LocaleSelect from './Common/LocaleSelect';

interface IProps {
	location: object;
	network: number;
	locale: string;
	ethBalance: IEthBalance;
	updateLocale: (locale: string) => any;
}

export default class Header extends React.Component<IProps> {
	public render() {
		const { network, ethBalance } = this.props;
		const locale = this.props.locale || CST.LOCALE_EN;
		//const path = (location as any).pathname.toLowerCase();
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
							<div className="nav-bal-item">
								<div>{CST.TH_ETH}</div>
								<div className="nav-bal-value">
									{util.formatBalance(ethBalance.eth)}
								</div>
							</div>
							<div className="nav-bal-item">
								<div>{CST.TH_WETH}</div>
								<div className="nav-bal-value">
									{util.formatBalance(ethBalance.weth)}
								</div>
							</div>
						</div>
					</div>
					{network ? (
						(__KOVAN__ && network !== CST.NETWORK_ID_KOVAN) ||
						(!__KOVAN__ && network !== CST.NETWORK_ID_MAIN) ? (
							<span className="error-msg">{CST.TT_NETWORK_CHECK[locale]}</span>
						) : (
							''
						)
					) : null}
					<SDivFlexCenter horizontal>
						<div className="nav-button-wrapper">
							<Link to={'/status'}>{CST.AC_ACCOUNT.toUpperCase()}</Link>
						</div>
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
