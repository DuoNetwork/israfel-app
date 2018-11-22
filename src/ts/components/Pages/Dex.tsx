import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IOrderBookSnapshot, IUserOrder } from 'ts/common/types';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
import AllowanceCard from '../Cards/AllowanceCard';
import OperationCard from '../Cards/OperationCard';
import OperationHistory from '../Cards/OperationHistory';
import PriceOrderBookCard from '../Cards/PriceOrderBookCard';
import WrapEtherCard from '../Cards/WrapEtherCard';

interface IProps {
	pair: string;
	locale: string;
	account: string;
	userOrders: IUserOrder[];
	updateOrders: IUserOrder;
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
		const { userOrders, locale, updateOrders, orderBook } = this.props;
		return (
			<Layout>
				<div className="App">
					<Header />
					<SDivFlexCenter center horizontal>
						<OperationHistory
							updateOrders={updateOrders}
							userOrder={userOrders}
							locale={locale}
						/>
						<Affix offsetTop={10}>
							<OperationCard />
						</Affix>
					</SDivFlexCenter>
					<SDivFlexCenter center horizontal>
						<Affix offsetTop={10}>
							<AllowanceCard />
						</Affix>
						<Affix offsetTop={10}>
							<WrapEtherCard />
						</Affix>
						<Affix offsetTop={10}>
							<PriceOrderBookCard OrderBookSnapshot={orderBook} />
						</Affix>
					</SDivFlexCenter>
				</div>
			</Layout>
		);
	}
}
