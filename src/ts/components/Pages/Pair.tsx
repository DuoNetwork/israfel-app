// import { Spin } from 'antd';
// import { Affix } from 'antd';
// import * as React from 'react';
// // import * as CST from 'ts/common/constants';
// import { IEthBalance, IOrderBookSnapshot, ITokenBalance, IUserOrder } from 'ts/common/types';
// // import web3Util from 'ts/common/web3Util';
// import { SDivFlexCenter } from '../_styled';
// import BalanceCard from '../Cards/BalanceCard';
// import OrderBookCard from '../Cards/OrderBookCard';
// import WrapEtherCard from '../Cards/WrapEtherCard';

// interface IProps {
// 	pair: string;
// 	locale: string;
// 	account: string;
// 	ethBalance: IEthBalance;
// 	tokenBalance: ITokenBalance;
// 	orderHistory: IUserOrder[];
// 	orderBook: IOrderBookSnapshot;
// 	subscribe: (pair: string) => any;
// 	unsubscribe: () => any;
// 	connection: boolean;
// }

// interface IState {
// 	account: string;
// 	pair: string;
// }

// export default class Pair extends React.Component<IProps> {
// 	constructor(props: IProps) {
// 		super(props);
// 		this.state = {
// 			account: props.account,
// 			pair: props.pair
// 		};
// 	}

// 	public componentDidMount() {
// 		this.props.subscribe(this.props.pair);
// 	}

// 	public static getDerivedStateFromProps(props: IProps, state: IState) {
// 		if (props.account !== state.account || props.pair !== state.pair) {
// 			props.unsubscribe();
// 			props.subscribe(props.pair);
// 			return {
// 				account: props.account,
// 				pair: props.pair
// 			};
// 		}

// 		return null;
// 	}

// 	public render() {
// 		const { orderBook, ethBalance, tokenBalance } = this.props;
// 		return (
// 			<Spin spinning={!this.props.connection} tip="loading...">
// 				<SDivFlexCenter key={2} center horizontal>
// 					<Affix offsetTop={10}>
// 						<WrapEtherCard />
// 					</Affix>
// 					<Affix offsetTop={10}>
// 						<OrderBookCard OrderBookSnapshot={orderBook} />
// 					</Affix>
// 				</SDivFlexCenter>
// 				<SDivFlexCenter key={3} center horizontal>
// 					<Affix offsetTop={10}>
// 						<BalanceCard eth={ethBalance} tokenBalance={tokenBalance} />
// 					</Affix>
// 				</SDivFlexCenter>
// 			</Spin>
// 		);
// 	}
// }
