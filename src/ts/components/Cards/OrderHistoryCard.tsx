import { Table } from 'antd';
import moment from 'moment';
import * as React from 'react';
// import wsUtil from 'ts/common/wsUtil';
import { IUserOrder } from '../../../../../israfel-relayer/src/common/types';
import * as CST from '../../common/constants';
// import util from '../../common/util';
import { SCard, SCardTitle } from './_styled';
import { STableWrapper } from './_styled';

const Column = Table.Column;

interface IProps {
	userOrders: IUserOrder[];
	locale: string;
}

const parseRow: (uo: IUserOrder, isParent: boolean) => any = (
	uo: IUserOrder,
	isParent: boolean
) => {
	const row: { [key: string]: any } = {
		key: uo.currentSequence,
		[CST.TH_SIDE]: uo.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL,
		[CST.TH_PX]: uo.price,
		[CST.TH_AMT]: uo.amount,
		[CST.TH_BALANCE]: uo.balance,
		[CST.TH_FILL]: uo.fill,
		[CST.TH_EXPIRY]: moment(uo.expiry).format('YYYY-MM-DD HH:mm'),
		[CST.TH_ORDER_HASH]: uo.orderHash
	};
	if (isParent) row.children = [];

	return row;
};

export default class OrderHistoryCard extends React.Component<IProps> {
	public render() {
		const userOrders = this.props.userOrders;
		let dataSource = [];
		if (userOrders.length) {
			dataSource = [];
			userOrders.sort(
				(a, b) =>
					-a.initialSequence + b.initialSequence || -a.currentSequence + b.currentSequence
			);
			let parentRow = parseRow(userOrders[0], true);
			for (let i = 1; i < userOrders.length; i++) {
				const userOrder = userOrders[i];
				if (userOrder.orderHash !== parentRow[CST.TH_ORDER_HASH]) {
					dataSource.push(parentRow);
					parentRow = parseRow(userOrder, true);
				} else parentRow.children.push(parseRow(userOrder, false));
			}
		}

		return (
			<SCard
				title={
					<SCardTitle>{(CST.TH_ORDER + " " + CST.TH_HISTORY).toUpperCase()}</SCardTitle>
				}
				width="760px"
				margin="0 10px 0 10px"
			>
				<STableWrapper>
					<Table dataSource={dataSource} pagination={false} style={{ width: '800px' }}>
						{[
							CST.TH_SIDE,
							CST.TH_PX,
							CST.TH_AMT,
							CST.TH_BALANCE,
							CST.TH_FILL,
							CST.TH_EXPIRY
						].map(c => (
							<Column key={c} title={c} dataIndex={c} />
						))}
					</Table>
				</STableWrapper>
			</SCard>
		);
	}
}
