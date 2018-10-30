import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IWsUserOrderResponse } from '../../../../israfel-relayer/src/common/types';
import {
	IWSAskBid,
} from '../common/types';
import { SDivFlexCenter } from './_styled';
import OperationCard from './Cards/OperationCard';
import OperationHistory from './Cards/OperationHistory';
// import OperationCard from './Cards/OperationCard';
// import OrderbookCardSubscription from './Cards/OrderbookCardSubscription';
import Header from './Header';

export interface IProps {
	wsUserOrderResponse: IWsUserOrderResponse;
	locale: string;
	// states: ICustodianStates;
	// prices: ICustodianPrices;
	// balances: IBalances;
	bidAskMsg: IWSAskBid;
	account: string;
	gasPrice: number;
	refresh: () => any;
	// addOrder: () => any;
	subscription: (marketId: string, pair: string) => any;
	submitOrders: (amount: number, price: number, action: string) => any;
	// cancelOrder: () => any;
}

export default class Admin extends React.PureComponent<IProps> {
	public componentDidUpdate() {
		console.log('componentDidUpdate');
	}

	public componentDidMount() {
		// this.props.subscription('orderbook', 'ZRX-WETH');
		console.log('componentDidMount');
	}

	constructor(props: IProps) {
		super(props);
	}
	public render() {
		const {
			wsUserOrderResponse,
			locale,
			submitOrders
		} = this.props;
		return (
			<Layout>
				<div className="App">
					<Header location={location} />
					<SDivFlexCenter center horizontal>
						<OperationHistory askBidMsg={wsUserOrderResponse.userOrder} locale={locale} />
						<Affix offsetTop={10}>
							<OperationCard
								submitOrders={(a: number, p: number, q: string) =>
									submitOrders(a, p, q)
								}
							/>
						</Affix>
					</SDivFlexCenter>
				</div>
			</Layout>
		);
	}
}
