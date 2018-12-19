import close from 'images/icons/close.svg';
import moment from 'moment';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IUserOrder } from 'ts/common/types';
// import util from 'ts/common/util';
import { SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	orders: IUserOrder[];
	handleClose: () => void;
}

const getOrderDescription = (order: IUserOrder) => {
	const code1 = order.pair.split('|')[0];
	return `${order.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL} ${order.amount} ${code1} of ${
		order.pair
	} at ${order.price}. Total ${order.fill} filled.`;
};

const getVersionDescription = (order: IUserOrder) => {
	if (order.type === CST.DB_ADD) return 'Order submitted.';

	if (order.type === CST.DB_UPDATE) {
		let description = '';
		if (order.fill) description = `Total ${order.fill} filled.`;
		if (order.matching) description += ` ${order.matching} matching`;
		return description;
	}

	if (order.type === CST.DB_TERMINATE)
		if (order.status === CST.DB_CONFIRMED)
			return order.updatedAt || 0 < order.expiry ? 'Cancelled by user.' : 'Expired';
		else if (order.status === CST.DB_BALANCE) return 'Cancelled due to insufficent balance.';
		else if (order.status === CST.DB_MATCHING) return 'Cancelled due to matching error.';
		else if (order.status === CST.DB_FILL) return 'Fully filled';
	return 'Invalid order';
};

export default class OrderDetailCard extends React.Component<IProps> {
	public render() {
		const { orders, handleClose } = this.props;
		const visible = orders.length > 0;
		if (!visible) return null;
		const lastVersion = orders[0];
		return (
			<div style={{ display: visible ? 'block' : 'none' }}>
				<div className={'popup-bg ' + (visible ? 'popup-open-bg' : '')} />
				<SCard
					title={
						<SCardTitle>
							{CST.TH_ORDER.toUpperCase() + ' ' + CST.TH_DETAIL.toUpperCase()}
						</SCardTitle>
					}
					width="600px"
					className={'popup-card ' + (visible ? 'popup-open' : '')}
					noBodymargin
					extra={<img className="cardpopup-close" src={close} onClick={handleClose} />}
				>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul>
								<li>{getOrderDescription(lastVersion)}</li>
								{orders.map(o => (
									<li key={o.currentSequence}>
										<span>
											{moment(o.updatedAt || o.createdAt).format(
												'YYYY-MM-DD HH:mm:ss'
											)}
										</span>
										<span>{getVersionDescription(o)}</span>
									</li>
								))}
							</ul>
						</div>
					</SCardList>
				</SCard>
			</div>
		);
	}
}
