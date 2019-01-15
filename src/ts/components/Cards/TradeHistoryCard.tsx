import * as React from 'react';
import * as CST from 'ts/common/constants';
import { ColorStyles } from 'ts/common/styles';
import { INotification, ITrade } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle } from './_styled';
import { SButton } from './_styled';

interface IProps {
	visible: boolean;
	trades: { [pair: string]: ITrade[] };
	notify: (notification: INotification) => any;
	handleClose: () => void;
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
		const { handleClose, trades, visible } = this.props;
		const { expandIndex } = this.state;

		const animated = visible ? 'animated' : '';

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
				className={'panel-wrap ' + animated}
				style={{ left: visible ? '0px' : '-200px' }}
			>
				<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
					<SCardList noMargin>
						<div className="status-list-wrapper">
							<ul>{showTradeList.length ? showTradeList : '-'}</ul>
						</div>
					</SCardList>
				</SDivFlexCenter>
				<SButton
					className="leftFixed"
					onClick={handleClose}
					style={{
						background: visible ? '#fff' : ColorStyles.MainColor,
						color: visible ? ColorStyles.MainColor : '#fff'
					}}
				>
					{`${
						visible
							? CST.TH_HIDE + ' ' + CST.TH_TRADE + ' ∧'
							: CST.TH_SHOW + ' ' + CST.TH_TRADE + '  ∨'
					}`}
				</SButton>
			</SCard>
		);
	}
}
