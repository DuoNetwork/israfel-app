import * as React from 'react';
import { IUserOrder } from '../../../../../israfel-relayer/src/common/types';
import * as CST from '../../common/constants';
import util from '../../common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardTitle } from './_styled';
import { SCardList } from './_styled';

interface IProps {
	userOrder: IUserOrder[];
	locale: string;
}

export default class TimeSeriesCard extends React.Component<IProps> {

	public render() {
		const { userOrder } = this.props;
		const title = CST.TH_ORDERBOOK.toUpperCase();
		const step = userOrder ? util.range(0, userOrder.length) : [];
		return (
			<SCard title={<SCardTitle>{title}</SCardTitle>} width="800px" margin="0 10px 0 0">
				<SDivFlexCenter center horizontal>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className="right">
									<span className="title">{CST.TH_ACTIONS.toUpperCase()}</span>
								</li>
								{ userOrder && userOrder.length ? (
									util.range(0, userOrder.length).map((i: any) => (
										<li key={i} style={{ height: '28px' }}>
											<span className="content">
												{i < userOrder.length
													? userOrder[i].amount !== 0
														? util.formatNumber(userOrder[i].amount)
														: '-'
													: '-'}
											</span>
											<span className="title">
												{i < userOrder.length
													? userOrder[i].price !== 0
														? util.formatNumber(userOrder[i].price)
														: '-'
													: '-'}
											</span>
											<span className="title">
												{i < userOrder.length
													? userOrder[i].price !== 0
														? userOrder[i].side
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
											<span className="title"> {userOrder[i].status} </span>
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
										<li key={i} style={{ height: '28px' }}>
											<button className={'form-button'}>cancel</button>
										</li>
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
