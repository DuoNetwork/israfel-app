import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
// import { IWsUserOrderResponse } from '../common/types';
import { SDivFlexCenter } from './_styled';
import OperationCard from './Cards/OperationCard';
// import OperationHistory from './Cards/OperationHistory';
// import OperationCard from './Cards/OperationCard';
// import OrderbookCardSubscription from './Cards/OrderbookCardSubscription';
import Header from './Header';

export interface IProps {
	// wsUserOrderResponse: IWsUserOrderResponse;
	network: number;
	locale: string;
	account: string;
	updateLocale: (locale: string) => any;
	// refresh: () => any;
	// subscription: (marketId: string, pair: string) => any;
	// submitOrders: (amount: number, price: number, action: string) => any;
}

export default class Dex extends React.PureComponent<IProps> {
	public render() {
		const { locale, network, updateLocale } = this.props;
		return (
			<Layout>
				<div className="App">
					<Header locale={locale} network={network} updateLocale={updateLocale} />
					<SDivFlexCenter center horizontal>
						{/* <OperationHistory
							askBidMsg={wsUserOrderResponse.userOrder}
							locale={locale}
						/> */}
						<Affix offsetTop={10}>
							<OperationCard />
						</Affix>
					</SDivFlexCenter>
				</div>
			</Layout>
		);
	}
}
