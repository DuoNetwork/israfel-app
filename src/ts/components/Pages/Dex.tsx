import { Layout, Spin } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IEthBalance, IOrderBookSnapshot, ITokenBalance, IUserOrder } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
import BalanceCard from '../Cards/BalanceCard';
import OrderBookCard from '../Cards/OrderBookCard';
import OrderCard from '../Cards/OrderCard';
import OrderHistoryCard from '../Cards/OrderHistoryCard';
import WrapEtherCard from '../Cards/WrapEtherCard';

interface IProps {
	pair: string;
	locale: string;
	account: string;
	ethBalance: IEthBalance;
	tokenBalance: ITokenBalance;
	userOrders: IUserOrder[];
	orderBook: IOrderBookSnapshot;
	subscribe: (pair: string) => any;
	unsubscribe: () => any;
	connection: boolean;
}

interface IState {
	pair: string;
}

export default class Dex extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			pair: props.pair
		};
	}

	public componentDidMount() {
		this.props.subscribe(this.props.pair);
	}

	public static getDerivedStateFromProps(props: IProps, state: IState) {
		if (props.pair !== state.pair) {
			props.unsubscribe();
			props.subscribe(props.pair);
			return {
				pair: props.pair
			};
		}

		return null;
	}

	public render() {
		const {
			userOrders,
			locale,
			orderBook,
			account,
			pair,
			ethBalance,
			tokenBalance
		} = this.props;
		return (
			<Layout>
				<div className="App">
					<Header />
					<Spin spinning={!this.props.connection} tip="loading...">
						<SDivFlexCenter key={1} center horizontal>
							<OrderHistoryCard userOrders={userOrders} locale={locale} />
							<Affix offsetTop={10}>
								<OrderCard
									account={account}
									pair={pair}
									ethBalance={ethBalance}
									tokenBalance={tokenBalance}
								/>
							</Affix>
						</SDivFlexCenter>
						<SDivFlexCenter key={2} center horizontal>
							<Affix offsetTop={10}>
								<WrapEtherCard />
							</Affix>
							<Affix offsetTop={10}>
								<OrderBookCard OrderBookSnapshot={orderBook} />
							</Affix>
						</SDivFlexCenter>
						<SDivFlexCenter key={3} center horizontal>
							<Affix offsetTop={10}>
								<BalanceCard eth={ethBalance} tokenBalance={tokenBalance} />
							</Affix>
						</SDivFlexCenter>
						<div key={4} style={{ color: 'white' }}>
							<button
								onClick={() =>
									web3Util
										.web3PersonalSign(account, '0xOrderHash')
										.then(result => console.log(result))
								}
							>
								Sign
							</button>
						</div>
					</Spin>
				</div>
			</Layout>
		);
	}
}
