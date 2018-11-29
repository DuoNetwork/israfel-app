import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IOrderBook, IOrderBookSnapshot } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardTitle } from './_styled';
import { SCardList } from './_styled';

interface IProps {
	OrderBookSnapshot: IOrderBookSnapshot;
}

interface IState {
	searchTextVolume: string;
	searchTextVolumeBidResult: string;
	searchTextVolumeAskResult: string;
	orderBook: IOrderBook;
}

let askArray: number[][] = [];
let bidArray: number[][] = [];

export default class OrderBookCard extends React.Component<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			searchTextVolume: '',
			searchTextVolumeBidResult: '',
			searchTextVolumeAskResult: '',
			orderBook: props.orderBook
		};
	}

	public render() {
		const { OrderBookSnapshot } = this.props;
		askArray = [];
		bidArray = [];
		if (OrderBookSnapshot) {
			const asks = OrderBookSnapshot.asks;
			const bids = OrderBookSnapshot.bids;
			for (let i = 0; i < asks.length; i++) askArray.push([asks[i].balance, asks[i].price]);
			for (let i = 0; i < bids.length; i++) bidArray.push([bids[i].balance, bids[i].price]);
		}
		askArray.sort((a, b) => a[1] - b[1]);
		bidArray.sort((a, b) => b[1] - a[1]);
		return (
			<div>
				<SCard
					title={<SCardTitle>{CST.DB_ORDER_BOOKS.toUpperCase()}</SCardTitle>}
					width="400px"
					margin="0 0 0 5px"
				>
					<SDivFlexCenter width="370px" center horizontal>
						<SCardList>
							<div className="status-list-wrapper">
								<ul>
									<li className="right">
										<span className="title">{CST.DB_BID.toUpperCase()}</span>
									</li>
									{bidArray.length ? (
										bidArray.map((bid, i) => (
											<li key={i}>
												<span className="content">
													{bid[1] !== 0
														? util.formatNumber(bidArray[i][0])
														: '-'}
												</span>
												<span className="title">
													{bid[0] !== 0
														? util.formatNumber(bidArray[i][1])
														: '-'}
												</span>
											</li>
										))
									) : (
										<li className="block-title t-center">-</li>
									)}
								</ul>
							</div>
						</SCardList>
						<SCardList>
							<div className="status-list-wrapper">
								<ul>
									<li>
										<span className="title">{CST.DB_ASK.toUpperCase()}</span>
									</li>
									{askArray.length ? (
										askArray.map((ask, i) => (
											<li key={i}>
												<span className="title">
													{ask[0] !== 0
														? util.formatNumber(askArray[i][1])
														: '-'}
												</span>
												<span className="content">
													{ask[1] !== 0
														? util.formatNumber(askArray[i][0])
														: '-'}
												</span>
											</li>
										))
									) : (
										<li className="block-title t-center">-</li>
									)}
								</ul>
							</div>
						</SCardList>
					</SDivFlexCenter>
				</SCard>
			</div>
		);
	}
}
