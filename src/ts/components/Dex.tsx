import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IUserOrder } from 'ts/common/types';
import { SDivFlexCenter } from './_styled';
import OperationCard from './Cards/OperationCard';
import OperationHistory from './Cards/OperationHistory';
import Header from './Header';

export interface IProps {
	network: number;
	locale: string;
	account: string;
	userOrders: IUserOrder[];
	updateLocale: (locale: string) => any;
}

export default class Dex extends React.PureComponent<IProps> {
	public render() {
		const { userOrders, locale, network, updateLocale } = this.props;
		return (
			<Layout>
				<div className="App">
					<Header locale={locale} network={network} updateLocale={updateLocale}/>
					<SDivFlexCenter center horizontal>
						<OperationHistory
							userOrder={userOrders}
							locale={locale}
						/>
						<Affix offsetTop={10}>
							<OperationCard />
						</Affix>
					</SDivFlexCenter>
				</div>
			</Layout>
		);
	}
}
