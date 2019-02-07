import { Table } from 'antd';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { INotification } from 'ts/common/types';
import util from 'ts/common/util';
import { Constants, IUserOrder } from '../../../../../israfel-common/src';
import { SButton, SCard, STableWrapper } from './_styled';
import OrderDetailCard from './OrderDetailCard';

const Column = Table.Column;

interface IProps {
	orderHistory: { [pair: string]: IUserOrder[] };
	account: string;
	web3PersonalSign: (account: string, message: string) => Promise<string>;
	deleteOrder: (pair: string, orderHashes: string[], signature: string) => void;
	notify: (notification: INotification) => any;
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
		const { orderHistory, account, web3PersonalSign, deleteOrder, notify } = this.props;
		const { showHistory, details } = this.state;
		const dataSource: any[] = [];
		const liveOrders: { [orderHash: string]: IUserOrder[] } = {};
		const pastOrders: { [orderHash: string]: IUserOrder[] } = {};
		for (const pair in orderHistory) {
			const pairOrders = orderHistory[pair];
			pairOrders.forEach(order => {
				const { orderHash, type } = order;
				// an order can only have one terminate version
				if (type === Constants.DB_TERMINATE) pastOrders[orderHash] = [order];
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
					[CST.TH_TIME]: util.formatTime(lastVersion.createdAt),
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
					[CST.TH_TIME]: util.formatTime(lastVersion.createdAt),
					[CST.TH_ORDER]: util.getOrderFullDescription(lastVersion),
					[CST.TH_ACTIONS]: (
						<Popconfirm
							title={CST.TT_DELETE_ORDER}
							icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
							onConfirm={() => {
								notify({
									level: 'info',
									title: CST.TH_ORDERS,
									message:
										'Pending signature for deleting orders. Please check your MetaMask!',
									transactionHash: ''
								});
								web3PersonalSign(account, Constants.TERMINATE_SIGN_MSG + orderHash).then(
									result => deleteOrder(lastVersion.pair, [orderHash], result)
								);
							}}
						>
							<a className="order-cancel">{CST.TH_CANCEL}</a>
						</Popconfirm>
					),
					[CST.TH_HISTORY]: orders
				});
			}
		dataSource.sort((a, b) => -a[CST.TH_TIME].localeCompare(b[CST.TH_TIME]));
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
							style={{
								borderLeft: 'none',
								opacity: !showHistory ? 1 : 0.5,
								marginLeft: 0,
								paddingLeft: 0
							}}
						>
							{'Open ' + CST.TH_ORDERS}
						</div>
						<div className="switch-button" style={{ opacity: showHistory ? 1 : 0.5 }}>
							{'Past ' + CST.TH_ORDERS}
						</div>
					</div>
				}
				width="740px"
				margin="0 10px 20px 10px"
				extra={
					<SButton className="export-button" onClick={this.handleExport}>
						Export to CSV
					</SButton>
				}
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
