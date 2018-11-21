import { Layout } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IOrderBookSnapshot, IUserOrder } from 'ts/common/types';
import { SDivFlexCenter } from './_styled';
import AllowanceCard from './Cards/AllowanceCard';
import OperationCard from './Cards/OperationCard';
import OperationHistory from './Cards/OperationHistory';
import WrapEtherCard from './Cards/WrapEtherCard';
import Header from './Header';

interface IProps {
	pair: string;
	network: number;
	locale: string;
	account: string;
	userOrders: IUserOrder[];
	orderBook: IOrderBookSnapshot;
	updateLocale: (locale: string) => any;
	subscribe: (pair: string) => any;
	unsubscribe: () => any;
}

interface IState {
	pair: string;
}

export default class Dex extends React.PureComponent<IProps> {
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
		const { userOrders, locale, network, updateLocale, orderBook } = this.props;
		return (
			<Layout>
				<div className="App">
					<Header locale={locale} network={network} updateLocale={updateLocale} />
					<SDivFlexCenter center horizontal>
						<OperationHistory userOrder={userOrders} locale={locale} />
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
					</SDivFlexCenter>
					<div style={{ color: 'white' }}>
						<pre>{JSON.stringify(orderBook, null, 4)}</pre>
					</div>
				</div>
			</Layout>
		);
	}
}
