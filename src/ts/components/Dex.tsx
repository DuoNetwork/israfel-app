import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IUserOrder } from 'ts/common/types';
// import { IWsUserOrderResponse } from '../common/types';
import { SDivFlexCenter } from './_styled';
import OperationCard from './Cards/OperationCard';
import OperationHistory from './Cards/OperationHistory';
// import OperationCard from './Cards/OperationCard';
// import OrderbookCardSubscription from './Cards/OrderbookCardSubscription';
import Header from './Header';

export interface IProps {
	// wsUserOrderResponse: IWsUserOrderResponse;
	network: number;
	locale: string;
	account: string;
	userOrders: IUserOrder[];
	updateLocale: (locale: string) => any;
	// refresh: () => any;
	// subscription: (marketId: string, pair: string) => any;
	// submitOrders: (amount: number, price: number, action: string) => any;
}

export default class Dex extends React.PureComponent<IProps> {
	public render() {
		const { userOrders, locale, network, updateLocale } = this.props;
		console.log(userOrders);
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
