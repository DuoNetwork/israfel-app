import * as React from 'react';
import { IUserOrder } from '../../../../../israfel-relayer/src/common/types';
import * as CST from '../../common/constants';
import { IWSOrderBookSubscription } from '../../common/types';
import util from '../../common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardTitle } from './_styled';
import { SCardList } from './_styled';

interface IProps {
	askBidMsg: IUserOrder;
	locale: string;
}

interface IState {
	orderBookSubscription: IWSOrderBookSubscription;
}

export default class TimeSeriesCard extends React.Component<IProps, IState> {

	public render() {
		const { askBidMsg } = this.props;
		const title = CST.TH_ORDERBOOK.toUpperCase();
		const askBidArray: IUserOrder[] = [];
		if (askBidMsg && askBidMsg.amount !== 0) askBidArray.push(askBidMsg);
		const step = util.range(0, askBidArray.length);
		return (
			<SCard title={<SCardTitle>{title}</SCardTitle>} width="800px" margin="0 10px 0 0">
				<SDivFlexCenter center horizontal>
					<SCardList>
						<div className="status-list-wrapper">
							<ul>
								<li className="right">
									<span className="title">{CST.TH_ACTIONS.toUpperCase()}</span>
								</li>
								{askBidArray.length ? (
									util.range(0, askBidArray.length).map((i: any) => (
										<li key={i} style={{ height: '28px' }}>
											<span className="content">
												{i < askBidArray.length
													? askBidArray[i].amount !== 0
														? util.formatNumber(askBidArray[i].amount)
														: '-'
													: '-'}
											</span>
											<span className="title">
												{i < askBidArray.length
													? askBidArray[i].price !== 0
														? util.formatNumber(askBidArray[i].price)
														: '-'
													: '-'}
											</span>
											<span className="title">
												{i < askBidArray.length
													? askBidArray[i].price !== 0
														? askBidArray[i].side
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
											<span className="title"> {askBidArray[i].status} </span>
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
