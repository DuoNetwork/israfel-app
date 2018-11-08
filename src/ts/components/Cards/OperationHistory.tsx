import { Popconfirm } from 'antd';
import { Select } from 'antd';
import moment from 'moment';
import * as React from 'react';
import wsUtil from 'ts/common/wsUtil';
import { IUserOrder } from '../../../../../israfel-relayer/src/common/types';
import * as CST from '../../common/constants';
import util from '../../common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardTitle } from './_styled';
import { SCardList } from './_styled';

interface IProps {
	orderHistory: IUserOrder[];
	userOrder: IUserOrder[];
	locale: string;
}

interface IState {
	orderHash: string;
	mode: string;
}

let orderHash: string = '';
const Option = Select.Option;
let summaryList: IUserOrder[] = [];
let displayData: IUserOrder[] = [];

export default class OperationHistory extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			orderHash: '',
			mode: CST.TH_MODE[0]
		};
	}

	private setOrderHash(index: any) {
		orderHash = this.props.orderHistory[index].orderHash;
	}

	private handleChangeMode(value: any) {
		this.setState({
			mode: value
		});
	}

	private deleteOrder() {
		wsUtil.deleteOrder(orderHash);
	}

	public render() {
		const { orderHistory } = this.props;
		// const { userOrder } = this.props;
		const children = CST.TH_MODE.map(mode => (
			<Option key={mode} value={mode}>
				{mode}
			</Option>
		));
		// for (let i = 0; i < userOrder.length; i++)
		// 	if (userOrder[i].type === 'add')
		// 		orderHistory = util.addOrder(orderHistory, userOrder[i]);
		const title = CST.TH_ORDER_HISTORY.toUpperCase();
		summaryList = [];
		orderHistory.sort(
			(a, b) =>
				a.orderHash === b.orderHash
					? (a.updatedAt || Number(moment.now)) - (b.updatedAt || Number(moment.now))
					: Number(a.orderHash) - Number(b.orderHash)
		);
		for (let i = 1; i < orderHistory.length; i++)
			if (orderHistory[i].orderHash !== orderHistory[i - 1].orderHash)
				summaryList.push(orderHistory[i - 1]);
		if (orderHistory.length > 0)
			summaryList.push(orderHistory[orderHistory.length - 1]);
		orderHistory.sort(
			(a, b) => (a.updatedAt || Number(moment.now)) - (b.updatedAt || Number(moment.now))
		);
		if (this.state.mode === CST.TH_MODE[1]) displayData = summaryList;
		else displayData = orderHistory;
		const step = displayData ? util.range(0, displayData.length) : [];

		return (
			<SCard
				title={
					<SCardTitle>
						{title}
						<Select
							value={this.state.mode}
							style={{ width: 200 }}
							onChange={e => this.handleChangeMode(e)}
						>
							{children}
						</Select>
					</SCardTitle>
				}
				width="800px"
				margin="0 10px 0 0"
			>
				<SDivFlexCenter center horizontal>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className="right">
									<span className="title" style={{ width: 30 }}>
										{CST.TH_AMT.toUpperCase()}
									</span>
									<span className="title" style={{ width: 30 }}>
										{CST.TH_BALANCE.toUpperCase()}
									</span>
									<span className="title" style={{ width: 30 }}>
										{CST.TH_PX.toUpperCase()}
									</span>
									<span className="title" style={{ width: 30 }}>
										{CST.TH_ASK.toUpperCase() + '/' + CST.TH_BID.toUpperCase()}
									</span>
									<span className="title" style={{ width: 30 }}>
										{CST.TH_ACTIONS}
									</span>
									<span className="title" style={{ width: 120 }}>
										{CST.TH_TIME}
									</span>
								</li>
								{displayData.length > 0 ? (
									displayData.map((data, i) => (
										<li key={i} style={{ height: '28px' }}>
											<span className="content">
												{data.amount ? util.formatNumber(data.amount) : '-'}
											</span>
											<span className="content">
												{data.balance ? util.formatNumber(data.balance) : '-'}
											</span>
											<span className="title">
												{data.price ? util.formatNumber(data.price) : '-'}
											</span>
											<span className="title">
												{data.side ? data.side : '-'}
											</span>
											<span className="title">
												{data.type ? data.type : '-'}
											</span>
											<span className="title">
												{data.createdAt
													? moment(data.createdAt).format(
															'DD-MM-YYYY HH:mm:ss'
													)
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

					<SCardList fixWidth style={{ width: '100px' }}>
						<div className="status-list-wrapper narrow">
							<ul className="noborder">
								<li>
									<span className="title">{CST.TH_STATUS}</span>
								</li>
								{step.length > 0 ? (
									step.map((i: any) => (
										<li key={i} style={{ height: '28px' }}>
											<span className="title">{displayData[i].status}</span>
										</li>
									))
								) : (
									<li className="block-title t-center">...</li>
								)}
							</ul>
						</div>
					</SCardList>

					<SCardList fixWidth style={{ width: '150px' }}>
						<div className="status-list-wrapper narrow">
							<ul className="noborder">
								<li>
									<span className="title">{CST.TH_ACTIONS}</span>
								</li>
								{step.length > 0 ? (
									step.map((i: any) => (
										<Popconfirm
											key={i + ''}
											placement="top"
											title={CST.TH_DELETE_ORDER}
											okText="Confirm"
											cancelText="Cancel"
											onConfirm={this.deleteOrder}
										>
											<li
												key={i}
												style={{ height: '28px' }}
												onClick={this.setOrderHash.bind(this, i)}
											>
												<button
													className={'form-button'}
													disabled={
														displayData[i].status === 'pending' ||
														displayData[i].type === 'terminate' ||
														summaryList.indexOf(displayData[i]) === -1
													}
												>
													cancel
												</button>
											</li>
										</Popconfirm>
									))
								) : (
									<li className="block-title t-center">...</li>
								)}
							</ul>
						</div>
					</SCardList>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
