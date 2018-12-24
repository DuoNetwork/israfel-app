import { Table } from 'antd';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IUserOrder } from 'ts/common/types';
import util from 'ts/common/util';
import web3Util from 'ts/common/web3Util';
import wsUtil from 'ts/common/wsUtil';
import { SCard, STableWrapper } from './_styled';
import OrderDetailCard from './OrderDetailCard';

const Column = Table.Column;

interface IProps {
	orderHistory: { [pair: string]: IUserOrder[] };
	account: string;
}

interface IState {
	showHistory: boolean;
	details: IUserOrder[];
}

export default class OrderHistoryCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			showHistory: false,
			details: []
		};
	}

	public handleExport = () => {
		const csvData =
			'data:text/csv;charset=utf-8,' + util.convertOrdersToCSV(this.props.orderHistory);
		const link = document.createElement('a');
		link.href = encodeURI(csvData);
		link.download = 'transactions_' + moment().format('YYYY-MM-DD_HH-mm-ss') + '.csv';
		// $FlowFixMe
		document.body.appendChild(link);
		link.click();
		// $FlowFixMe
		document.body.removeChild(link);
	};

	public render() {
		const { orderHistory, account } = this.props;
		const { showHistory, details } = this.state;
		const dataSource: object[] = [];
		const liveOrders: { [orderHash: string]: IUserOrder[] } = {};
		const pastOrders: { [orderHash: string]: IUserOrder[] } = {};
		for (const pair in orderHistory) {
			const pairOrders = orderHistory[pair];
			pairOrders.forEach(order => {
				const { orderHash, type } = order;
				// an order can only have one terminate version
				if (type === CST.DB_TERMINATE) pastOrders[orderHash] = [order];
				// if this order already has a terminate version,
				// put previous versions into past orders
				else if (pastOrders[orderHash]) pastOrders[orderHash].push(order);
				else {
					if (!liveOrders[orderHash]) liveOrders[orderHash] = [];
					liveOrders[orderHash].push(order);
				}
			});
		}
		if (showHistory)
			for (const orderHash in pastOrders) {
				const orders = pastOrders[orderHash];
				const lastVersion = orders[0];
				dataSource.push({
					key: orderHash,
					[CST.TH_TIME]: moment(lastVersion.createdAt).format('YYYY-MM-DD HH:mm'),
					[CST.TH_ORDER]: util.getOrderFullDescription(lastVersion),
					[CST.TH_HISTORY]: orders
				});
			}
		else
			for (const orderHash in liveOrders) {
				const orders = liveOrders[orderHash];
				const lastVersion = orders[0];
				dataSource.push({
					key: orderHash,
					[CST.TH_TIME]: moment(lastVersion.createdAt).format('YYYY-MM-DD HH:mm'),
					[CST.TH_ORDER]: util.getOrderFullDescription(lastVersion),
					[CST.TH_ACTIONS]: (
						<Popconfirm
							title={CST.TT_DELETE_ORDER}
							icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
							onConfirm={() =>
								web3Util
									.web3PersonalSign(account, CST.TERMINATE_SIGN_MSG + orderHash)
									.then(result =>
										wsUtil.deleteOrder(lastVersion.pair, orderHash, result)
									)
							}
						>
							<a className="order-cancel">{CST.TH_CANCEL}</a>
						</Popconfirm>
					),
					[CST.TH_HISTORY]: orders
				});
			}
		return (
			<SCard
				title={
					<div
						className="ordercard-header"
						onClick={() =>
							this.setState({
								showHistory: !showHistory
							})
						}
					>
						<div
							className="switch-button"
							style={{ borderLeft: 'none', opacity: !showHistory ? 1 : 0.5 }}
						>
							{('OPEN ' + CST.TH_ORDERS).toUpperCase()}
						</div>
						<div className="switch-button" style={{ opacity: showHistory ? 1 : 0.5 }}>
							{('PAST ' + CST.TH_ORDERS).toUpperCase()}
						</div>
					</div>
				}
				width="740px"
				margin="0 10px 50px 10px"
				extra={<button onClick={this.handleExport}>Export to CSV</button>}
			>
				<STableWrapper>
					<Table
						dataSource={dataSource}
						pagination={{
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total: number) =>
								CST.TH_TOTAL +
								' ' +
								total +
								' ' +
								(showHistory ? CST.TH_PAST : CST.TH_LIVE) +
								' ' +
								CST.TH_ORDERS,
							pageSize: 10,
							pageSizeOptions: ['10', '20', '50'],
							size: 'small'
						}}
						style={{ width: '100%' }}
					>
						<Column title={CST.TH_TIME} dataIndex={CST.TH_TIME} width={180} />
						<Column
							title={CST.TH_ORDER}
							dataIndex={CST.TH_ORDER}
							onCell={(record: { [key: string]: any }) => ({
								onClick: () =>
									this.setState({
										details: record[CST.TH_HISTORY] as IUserOrder[]
									})
							})}
						/>
						{showHistory ? null : (
							<Column
								key={CST.TH_ACTIONS}
								title={''}
								dataIndex={CST.TH_ACTIONS}
								width={100}
							/>
						)}
					</Table>
				</STableWrapper>
				<OrderDetailCard
					orders={details}
					handleClose={() => this.setState({ details: [] })}
				/>
			</SCard>
		);
	}
}
