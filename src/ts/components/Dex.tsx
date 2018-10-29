import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import {
	// IBalances,
	// ICustodianPrices,
	// ICustodianStates,
	IWSAskBid,
	IWSOrderBookSubscription
} from '../common/types';
import { SDivFlexCenter } from './_styled';
import OperationCard from './Cards/OperationCard';
import OperationHistory from './Cards/OperationHistory';
// import OperationCard from './Cards/OperationCard';
// import OrderbookCardSubscription from './Cards/OrderbookCardSubscription';

export interface IProps {
	wsSubMsg: IWSOrderBookSubscription;
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

	private async disconnect() {
		// this.props.cancelOrder();
	}

	private async subscription() {
		// this.props.subscription('orderbook', 'ZRX-WETH');
		console.log('subscription');
	}

	private addOrderButton() {
		// this.props.addOrder();
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
			// wsSubMsg, // states,
			// refresh,
			bidAskMsg,
			locale,
			submitOrders
		} = this.props;
		// prices,
		// balances,
		// account,
		// gasPrice
		return (
			<Layout>
				<div className="App">
					<header
						className="App-header"
						style={{ background: 'white', textAlign: 'center' }}
					>
						<h1 className="App-title">Welcome to DUO DEX</h1>
					</header>
					<p className="App-intro" style={{ textAlign: 'center' }}>
						<button
							onClick={() => this.addOrderButton()}
							style={{ margin: '0 0 0 20px' }}
						>
							Add Order
						</button>
						<button
							onClick={() => this.subscription()}
							style={{ margin: '0 0 0 20px' }}
						>
							Subscription
						</button>
						<button onClick={() => this.disconnect()} style={{ margin: '0 0 0 20px' }}>
							Cancel Order
						</button>
					</p>
					<SDivFlexCenter center horizontal>
						<OperationHistory askBidMsg={bidAskMsg} locale={locale} />
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
