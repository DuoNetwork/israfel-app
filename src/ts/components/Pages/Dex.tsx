import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IOrderBookSnapshot, IUserOrder } from 'ts/common/types';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
// import AllowanceCard from '../Cards/AllowanceCard';
import OrderBookCard from '../Cards/OrderBookCard';
import OrderCard from '../Cards/OrderCard';
import OrderHistoryCard from '../Cards/OrderHistoryCard';
import WrapEtherCard from '../Cards/WrapEtherCard';

interface IProps {
	pair: string;
	locale: string;
	account: string;
	userOrders: IUserOrder[];
	orderBook: IOrderBookSnapshot;
	subscribe: (pair: string) => any;
	unsubscribe: () => any;
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
		const { userOrders, locale, orderBook, account, pair } = this.props;
		return (
			<Layout>
				<div className="App">
					<Header />
					<SDivFlexCenter center horizontal>
						<OrderHistoryCard
							userOrders={userOrders}
							locale={locale}
						/>
						<Affix offsetTop={10}>
							<OrderCard account={account} pair={pair}/>
						</Affix>
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal>
						{/* <Affix offsetTop={10}>
							<AllowanceCard />
						</Affix> */}
						<Affix offsetTop={10}>
							<WrapEtherCard />
						</Affix>
						<Affix offsetTop={10}>
							<OrderBookCard OrderBookSnapshot={orderBook} />
						</Affix>
					</SDivFlexCenter>
				</div>
			</Layout>
		);
	}
}
