import duoIcon from 'images/DUO_icon.png';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as CST from 'ts/common/constants';
import { SDivFlexCenter, SHeader } from './_styled';
import LocaleSelect from './Common/LocaleSelect';

interface IProps {
	location: object;
	network: number;
	locale: string;
	updateLocale: (locale: string) => any;
}

export default class Header extends React.Component<IProps> {
	public render() {
		const { location, network, updateLocale } = this.props;
		const locale = this.props.locale || CST.LOCALE_EN;
		const path = (location as any).pathname.toLowerCase();
		const isStatusPage = path.includes(CST.TH_STATUS.toLowerCase());
		return (
			<SHeader>
				<SDivFlexCenter horizontal width={'1200px'}>
					<Link to={'/'}>
						<div className="icon-wrapper">
							<img src={duoIcon} />
						</div>
					</Link>
					{network ? (
						(__KOVAN__ && network !== CST.NETWORK_ID_KOVAN) ||
						(!__KOVAN__ && network !== CST.NETWORK_ID_MAIN) ? (
							<span className="error-msg">{CST.TT_NETWORK_CHECK[locale]}</span>
						) : (
							''
						)
					) : null}
					<SDivFlexCenter horizontal>
						{!isStatusPage ? (
							<div className="nav-button-wrapper">
								<Link to={'/status'}>{CST.TH_STATUS.toUpperCase()}</Link>
							</div>
						) : null}
						<LocaleSelect locale={locale} onSelect={updateLocale} />
					</SDivFlexCenter>
				</SDivFlexCenter>
			</SHeader>
		);
	}
}
