import { Layout, Spin } from 'antd';
import { Affix } from 'antd';
import * as React from 'react';
import { IEthBalance, IOrderBookSnapshot, ITokenBalance, IUserOrder } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import Header from 'ts/containers/HeaderContainer';
import { SDivFlexCenter } from '../_styled';
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
					{this.props.connection ? (
						[
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
							</SDivFlexCenter>,
							<SDivFlexCenter key={2} center horizontal>
								<Affix offsetTop={10}>
									<WrapEtherCard />
								</Affix>
								<Affix offsetTop={10}>
									<OrderBookCard OrderBookSnapshot={orderBook} />
								</Affix>
							</SDivFlexCenter>,
							<div key={3} style={{ color: 'white' }}>
								<pre>{JSON.stringify(ethBalance, null, 4)}</pre>
							</div>,
							<div key={4} style={{ color: 'white' }}>
								<pre>{JSON.stringify(tokenBalance, null, 4)}</pre>
							</div>,
							<div key={5} style={{ color: 'white' }}>
							<button
								onClick={() =>
									web3Util.web3Wrapper
										.signTypedDataAsync(account, {
											types: {
												EIP712Domain: [
													{ name: 'name', type: 'string' },
													{ name: 'version', type: 'string' },
													{ name: 'chainId', type: 'uint256' },
												],
												Person: [
													{ name: 'name', type: 'string' },
													{ name: 'wallet', type: 'address' }
												],
												Mail: [
													{ name: 'from', type: 'Person' },
													{ name: 'to', type: 'Person' },
													{ name: 'contents', type: 'string' }
												]
											},
											primaryType: 'Mail',
											domain: {
												name: 'Ether Mail',
												version: '1',
												chainId: 42,
												verifyingContract:
													'0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
											},
											message: {
												from: {
													name: 'Cow',
													wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
												},
												to: {
													name: 'Bob',
													wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
												},
												contents: 'Hello, Bob!'
											}
										})
										.then(result => console.log(result))
								}
							>
								Sign
							</button>
						</div>
						]
					) : (
						<Spin />
					)}
				</div>
			</Layout>
		);
	}
}
