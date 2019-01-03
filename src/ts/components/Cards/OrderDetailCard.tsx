import close from 'images/icons/close.svg';
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
							{CST.TH_ORDER + ' ' + CST.TH_DETAIL}
						</SCardTitle>
					}
					style={{ overflow: 'visible !important' }}
					width="480px"
					className={'popup-card-oh ' + (visible ? 'popup-open' : '')}
					noBodymargin
					extra={<img className="cardpopup-close" src={close} onClick={handleClose} />}
				>
					<SCardList noMargin width="100%">
						<div className="status-list-wrapper">
							<ul style={{ padding: '0 10px', maxHeight: 256, overflowY: 'scroll' }}>
								<li>{util.getOrderDescription(lastVersion)}</li>
								{orders.map(o => (
									<li
										key={o.currentSequence}
										onClick={() => {
											if (o.transactionHash)
												window.open(
													`https://${
														__ENV__ === CST.DB_LIVE ? '' : 'kovan.'
													}etherscan.io/tx/${o.transactionHash}`,
													'_blank'
												);
										}}
										style={{cursor: o.transactionHash ? 'pointer' : 'default'}}
									>
										<span>
											{util.formatTimeSecond(o.updatedAt || o.createdAt)}
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
