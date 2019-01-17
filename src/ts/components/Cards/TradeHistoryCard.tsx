import { Select } from 'antd';
import { Table } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { INotification, ITrade } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle, SCardTitleSelector } from './_styled';

const Option = Select.Option;
const columns = [
	{
		title: 'pair',
		dataIndex: 'pair'
	},
	{
		title: 'amount',
		dataIndex: 'maker.amount'
	},
	{
		title: 'price',
		dataIndex: 'maker.price'
	},
	{
		title: 'timestamp',
		key: 'timestamp',
		dataIndex: 'timestamp',
		render: (time: any) => util.formatTime(time)
	}
];
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
			expandIndex: i
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
		return (
			<SCard
				title={<SCardTitle>{CST.TH_MARKET + ' ' + CST.TH_TRADES}</SCardTitle>}
				width="740px"
				margin="0 10px 20px 10px"
				extra={
					<SCardTitleSelector
						value={tradeKeylist[expandIndex]}
						style={{ width: 200 }}
						onSelect={(e: any) => this.handleShow(e)}
					>
						{tradeKeylist.map((e, i) => (
							<Option className="optionMarketTrades" value={i}>
								{e}
							</Option>
						))}
					</SCardTitleSelector>
				}
			>
				<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
					<SCardList noMargin>
						<div className="status-list-wrapper">
							<Table columns={columns} dataSource={tradeList[expandIndex]} />
						</div>
					</SCardList>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
