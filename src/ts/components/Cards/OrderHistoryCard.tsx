import { Table } from 'antd';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
import * as React from 'react';
// import wsUtil from 'ts/common/wsUtil';
import * as CST from 'ts/common/constants';
import { IUserOrder } from 'ts/common/types';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
// import util from '../../common/util';
import { SCard, SCardTitle } from './_styled';
import { STableWrapper } from './_styled';

const Column = Table.Column;

interface IProps {
	orderHistory: { [pair: string]: IUserOrder[] };
	account: string;
	display: boolean;
}

const parsePairRow: (pair: string) => any = pair => {
	return {
		key: pair,
		[CST.TH_PAIR]: pair,
		[CST.TH_SIDE]: '',
		[CST.TH_PX]: '',
		[CST.TH_AMT]: '',
		[CST.TH_BALANCE]: '',
		[CST.TH_FILL]: '',
		[CST.TH_MATCHING]: '',
		[CST.TH_FEE]: '',
		[CST.TH_EXPIRY]: '',
		[CST.TH_STATUS]: '',
		[CST.TH_ORDER_HASH]: '',
		[CST.TH_ACTIONS]: null,
		children: []
	};
};

const parseRow: (uo: IUserOrder, isParent: boolean, account: string, isCancel: boolean) => any = (
	uo,
	isParent,
	account,
	isCancel
) => {
	function handleClick(e: any, orderHash: string, pair: string, acc: string) {
		web3Util
			.web3PersonalSign(acc, CST.TERMINATE_SIGN_MSG + orderHash)
			.then(result => wsUtil.deleteOrder(pair, orderHash, result));
		console.log(e);
	}

	const row: { [key: string]: any } = {
		key: uo.currentSequence,
		[CST.TH_PAIR]: uo.pair,
		[CST.TH_SIDE]: uo.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL,
		[CST.TH_PX]: uo.price,
		[CST.TH_AMT]: uo.amount,
		[CST.TH_BALANCE]: uo.balance,
		[CST.TH_FILL]: uo.fill,
		[CST.TH_MATCHING]: uo.matching,
		[CST.TH_FEE]: uo.fee + ' ' + uo.feeAsset,
		[CST.TH_EXPIRY]: moment(uo.expiry).format('YYYY-MM-DD HH:mm'),
		[CST.TH_STATUS]: uo.type + '|' + uo.status,
		[CST.TH_ORDER_HASH]: uo.orderHash,
		[CST.TH_ACTIONS]:
			isParent && isCancel ? (
				<Popconfirm
					title={CST.TT_DELETE_ORDER}
					icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
					onConfirm={e => handleClick(e, uo.orderHash, uo.pair, account)}
				>
					<a style={{ color: '#f5222d' }}>cancel</a>
				</Popconfirm>
			) : null
	};
	if (isParent) row.children = [];
	return row;
};

export default class OrderHistoryCard extends React.Component<IProps> {
	public render() {
		const { orderHistory, account, display } = this.props;
		const dataSource = [];
		for (const pair in orderHistory) {
			const pairHistory = orderHistory[pair];
			const pairRow = parsePairRow(pair);
			let parentRow = [];
			if (pairHistory.length) {
				pairHistory.sort(
					(a, b) =>
						-a.initialSequence + b.initialSequence ||
						-a.currentSequence + b.currentSequence
				);
				if (pairHistory[0].type === 'terminate')
					parentRow = parseRow(pairHistory[0], true, account, false);
				else parentRow = parseRow(pairHistory[0], true, account, true);
				for (let i = 1; i < pairHistory.length; i++) {
					const userOrder = pairHistory[i];
					if (userOrder.orderHash !== parentRow[CST.TH_ORDER_HASH]) {
						pairRow.children.push(parentRow);
						if (userOrder.type === 'terminate')
							parentRow = parseRow(userOrder, true, account, false);
						else parentRow = parseRow(userOrder, true, account, true);
					} else parentRow.children.push(parseRow(userOrder, false, account, false));
				}
				pairRow.children.push(parentRow);
				dataSource.push(pairRow);
			}
		}
		return (
			<SCard
				title={
					<SCardTitle>{(CST.TH_ORDER + ' ' + CST.TH_HISTORY).toUpperCase()}</SCardTitle>
				}
				className={'order-history-card ' + (display ? 'history-show' : '')}
				width="1080px"
				margin="0 10px 0 10px"
			>
				<STableWrapper>
					<Table dataSource={dataSource} pagination={false} style={{ width: '100%' }}>
						{[
							CST.TH_PAIR,
							CST.TH_SIDE,
							CST.TH_PX,
							CST.TH_AMT,
							CST.TH_BALANCE,
							CST.TH_FILL,
							CST.TH_MATCHING,
							CST.TH_FEE,
							CST.TH_EXPIRY,
							CST.TH_STATUS,
							CST.TH_ACTIONS
						].map(c => (
							<Column key={c} title={c} dataIndex={c} />
						))}
					</Table>
				</STableWrapper>
			</SCard>
		);
	}
}
