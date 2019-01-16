import * as React from 'react';
import * as CST from 'ts/common/constants';
import { INotification, ITrade } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	trades: { [pair: string]: ITrade[] };
	notify: (notification: INotification) => any;
}

interface IState {
	expandIndex: number;
}

export default class TradeHistoryCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = { expandIndex: 0 };
	}

	private handleShow(i: number) {
		this.setState({
			expandIndex: i === this.state.expandIndex ? -1 : i
		});
	}

	public render() {
		const { trades } = this.props;
		const { expandIndex } = this.state;

		const tradeList: ITrade[][] = [];
		const tradeKeylist: string[] = [];

		for (const key in trades) {
			const subTradeList: ITrade[] = [];
			for (const subKey in trades[key]) subTradeList.push(trades[key][subKey]);
			tradeKeylist.push(key);
			tradeList.push(subTradeList);
		}
		const showTradeList: object[] = [];
		tradeList.forEach((c, i) => {
			const showSubTradeList: object[] = [];
			c.forEach((d, j) => {
				showSubTradeList.push(
					<li key={j} style={{ padding: '5px 5px' }}>
						<span className="title">{`Px:${util.formatPriceShort(
							d.taker.price
						)}`}</span>
						<span className="content">{`Amt:${util.formatNumber(
							d.taker.amount
						)}`}</span>
						<span className="content">{`Time:${util.formatTime(d.timestamp)}`}</span>
						<span className="content">{`Side:${d.taker.side}`}</span>
					</li>
				);
			});
			showTradeList.push(
				<li key={i} style={{ padding: '5px 5px', flexDirection: 'column' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							cursor: 'pointer'
						}}
						onClick={() => this.handleShow(i)}
					>
						<span className="title">{tradeKeylist[i]}</span>
						<span className="content">{i === expandIndex ? '-' : '+'}</span>
					</div>
					<ul
						style={{
							paddingLeft: 10,
							maxHeight: i === expandIndex ? 200 : 0,
							overflow: 'hidden'
						}}
					>
						{showSubTradeList.length ? showSubTradeList : 'No Trades'}
					</ul>
				</li>
			);
		});

		return (
			<SCard
				title={<SCardTitle>{CST.TH_MARKET + ' ' + CST.TH_TRADES}</SCardTitle>}
				width="740px"
				margin="0 10px 20px 10px"
			>
				<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
					<SCardList noMargin>
						<div className="status-list-wrapper">
							<ul>{showTradeList.length ? showTradeList : '-'}</ul>
						</div>
					</SCardList>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
