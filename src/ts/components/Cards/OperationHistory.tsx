import { Popconfirm } from 'antd';
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
}

let orderHash: string = '';

export default class TimeSeriesCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			orderHash: ''
		};
	}

	private setOrderHash(index: any) {
		orderHash = this.props.orderHistory[index].orderHash;
	}

	private deleteOrder() {
		wsUtil.deleteOrder(orderHash);
	}
	public render() {
		let { orderHistory } = this.props;
		const { userOrder } = this.props;
		console.log(userOrder);
		for (let i = 0; i < userOrder.length; i++)
			if (userOrder[i].type === 'add')
				orderHistory = util.addOrder(orderHistory, userOrder[i]);
		orderHistory = userOrder;
		const title = CST.TH_ORDERBOOK.toUpperCase();
		const step = orderHistory ? util.range(0, orderHistory.length) : [];
		return (
			<SCard title={<SCardTitle>{title}</SCardTitle>} width="800px" margin="0 10px 0 0">
				<SDivFlexCenter center horizontal>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className="right">
									<span className="title">{CST.TH_ACTIONS.toUpperCase()}</span>
								</li>
								{orderHistory && orderHistory.length ? (
									util.range(0, orderHistory.length).map((i: any) => (
										<li key={i} style={{ height: '28px' }}>
											<span className="content">
												{i < orderHistory.length
													? orderHistory[i].amount !== 0
														? util.formatNumber(orderHistory[i].amount)
														: '-'
													: '-'}
											</span>
											<span className="title">
												{i < orderHistory.length
													? orderHistory[i].price !== 0
														? util.formatNumber(orderHistory[i].price)
														: '-'
													: '-'}
											</span>
											<span className="title">
												{i < orderHistory.length
													? orderHistory[i].price !== 0
														? orderHistory[i].side
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

					<SCardList fixWidth style={{ width: '100px' }}>
						<div className="status-list-wrapper narrow">
							<ul className="noborder">
								<li>
									<span className="title">{CST.TH_STATUS}</span>
								</li>
								{step.length > 0 ? (
									step.map((i: any) => (
										<li key={i} style={{ height: '28px' }}>
											<span className="title">{orderHistory[i].status}</span>
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
													disabled={orderHistory[i].status === 'pending'}
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
