import close from 'images/icons/close.svg';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IUserOrder } from 'ts/common/types';
import { SCard, SCardTitle } from './_styled';

interface IProps {
	orders: IUserOrder[];
	handleClose: () => void;
}

export default class OrderDetailCard extends React.Component<IProps> {
	public render() {
		const { orders, handleClose } = this.props;
		const visible = orders.length > 0;
		return (
			<div style={{ display: visible ? 'block' : 'none' }}>
				<div className={'popup-bg ' + (visible ? 'popup-open-bg' : '')} />
				<SCard
					title={<SCardTitle>{CST.TH_ORDER.toUpperCase()}</SCardTitle>}
					width="600px"
					className={'popup-card ' + (visible ? 'popup-open' : '')}
					noBodymargin
					extra={<img className="cardpopup-close" src={close} onClick={handleClose} />}
				>
					{orders.map(order => (
						<div>{JSON.stringify(order)}</div>
					))}
				</SCard>
			</div>
		);
	}
}
