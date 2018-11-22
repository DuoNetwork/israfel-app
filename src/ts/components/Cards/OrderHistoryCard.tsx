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

const parseRow: (uo: IUserOrder) => any = (uo: IUserOrder) => ({
	key: uo.currentSequence,
	[CST.TH_SIDE]: uo.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL,
	[CST.TH_PX]: uo.price,
	[CST.TH_AMT]: uo.amount,
	[CST.TH_BALANCE]: uo.balance,
	[CST.TH_FILL]: uo.fill,
	[CST.TH_EXPIRY]: moment(uo.expiry).format('YYYY-MM-DD HH:mm'),
	[CST.TH_ORDER_HASH]: uo.orderHash,
	children: []
});

export default class OrderHistoryCard extends React.Component<IProps> {
	public render() {
		const userOrders = this.props.userOrders;
		const dataSource: object[] = [];
		if (userOrders.length) {
			userOrders.sort((a, b) => -a.currentSequence + b.currentSequence);
			let parentRow = parseRow(userOrders[0]);
			for (let i = 1; i < userOrders.length; i++) {
				const userOrder = userOrders[i];
				if (userOrder.orderHash !== parentRow.orderHash) {
					dataSource.push(parentRow);
					parentRow = parseRow(userOrder);
				} else parentRow.children.push(parseRow(userOrder));
			}
		}

		return (
			<SCard
				title={
					<SCardTitle>{(CST.TH_ORDER + ' ' + CST.TH_HISTORY).toUpperCase()}</SCardTitle>
				}
				width="800px"
				margin="0 10px 0 0"
			>
				<STableWrapper>
					<Table dataSource={dataSource} pagination={false}>
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
