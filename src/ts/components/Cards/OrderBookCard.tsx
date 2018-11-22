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
			for (let i = 0; i < asks.length; i++) askArray.push([asks[i].amount, asks[i].price]);
			for (let i = 0; i < bids.length; i++) bidArray.push([bids[i].amount, bids[i].price]);
		}
		askArray.sort((a, b) => b[1] - a[1]);
		bidArray.sort((a, b) => a[1] - b[1]);
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
										util.range(0, bidArray.length).map((i: any) => (
											<li key={i}>
												<span className="content">
													{i < bidArray.length
														? bidArray[i][1] !== 0
															? util.formatNumber(bidArray[i][1])
															: '-'
														: '-'}
												</span>
												<span className="title">
													{i < bidArray.length
														? bidArray[i][0] !== 0
															? util.formatNumber(bidArray[i][0])
															: '-'
														: '-'}
												</span>
											</li>
										))
									) : (
										<li className="block-title t-center">{CST.TH_LOADING}</li>
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
										util.range(0, askArray.length).map((i: any) => (
											<li key={i}>
												<span className="title">
													{i < askArray.length
														? askArray[i][0] !== 0
															? util.formatNumber(askArray[i][0])
															: '-'
														: '-'}
												</span>
												<span className="content">
													{i < askArray.length
														? askArray[i][1] !== 0
															? util.formatNumber(askArray[i][1])
															: '-'
														: '-'}
												</span>
											</li>
										))
									) : (
										<li className="block-title t-center">{CST.TH_LOADING}</li>
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
