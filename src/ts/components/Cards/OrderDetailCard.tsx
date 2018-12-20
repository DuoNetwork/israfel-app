import close from 'images/icons/close.svg';
import moment from 'moment';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IUserOrder } from 'ts/common/types';
import util from 'ts/common/util';
import { SCard, SCardList, SCardTitle } from './_styled';

interface IProps {
	orders: IUserOrder[];
	handleClose: () => void;
}

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
					style={{overflow: 'visible !important'}}
					width="600px"
					className={'popup-card-oh ' + (visible ? 'popup-open' : '')}
					noBodymargin
					extra={<img className="cardpopup-close" src={close} onClick={handleClose} />}
				>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul style={{padding: '0 10px', maxHeight: 256, overflowY: 'scroll'}}>
								<li>{util.getOrderDescription(lastVersion)}</li>
								{orders.map(o => (
									<li key={o.currentSequence}>
										<span>
											{moment(o.updatedAt || o.createdAt).format(
												'YYYY-MM-DD HH:mm:ss'
											)}
										</span>
										<span>{util.getVersionDescription(o)}</span>
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
