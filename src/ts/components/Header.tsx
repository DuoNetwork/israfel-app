import * as React from 'react';
import duoIcon from '../../images/DUO_icon.png';
import * as CST from '../common/constants';
import { SDivFlexCenter, SHeader } from './_styled';
import LocaleSelect from './Common/LocaleSelect';

interface IProps {
	network: number;
	width?: string;
	locale: string;
	updateLocale: (locale: string) => any;
}

export default class Header extends React.PureComponent<IProps> {
	public render() {
		const { network, width, updateLocale } = this.props;
		const locale = this.props.locale || CST.LOCALE_EN;
		return (
			<SHeader>
				<SDivFlexCenter horizontal width={width ? width : '1200px'}>
					<div className="icon-wrapper">
						<a
							href={
								'https://duo.network' + (locale === CST.LOCALE_CN ? '/cn.html' : '')
							}
						>
							<img src={duoIcon} />
						</a>
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
						{updateLocale ? (
							<LocaleSelect locale={locale} onSelect={updateLocale} />
						) : null}
					</SDivFlexCenter>
				</SDivFlexCenter>
			</SHeader>
		);
	}
}
