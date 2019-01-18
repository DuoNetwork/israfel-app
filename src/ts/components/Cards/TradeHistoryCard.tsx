import { Select } from 'antd';
import { Table } from 'antd';
import link from 'images/icons/linkBlack.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { ITrade } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle, SCardTitleSelector } from './_styled';
const Column = Table.Column;
const Option = Select.Option;
interface IProps {
	tokenBalances: Array<{ code: string; balance: number; address: string }>;
	trades: { [pair: string]: ITrade[] };
}

interface IState {
	pair: string;
}

export default class TradeHistoryCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			pair: props.tokenBalances.length ? props.tokenBalances[0].code + '|' + CST.TH_WETH : ''
		};
	}

	public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		if (!prevState.pair && nextProps.tokenBalances.length)
			return {
				pair: nextProps.tokenBalances[0].code + '|' + CST.TH_WETH
			};

		return null;
	}

	private handleSelect = (pair: string) => {
		this.setState({
			pair: pair
		});
	};

	public render() {
		const { tokenBalances, trades } = this.props;
		const { pair } = this.state;

		const pairs = tokenBalances.map(tb => tb.code + '|' + CST.TH_WETH);
		return (
			<SCard
				title={<SCardTitle>{CST.TH_MARKET + ' ' + CST.TH_TRADES}</SCardTitle>}
				width="740px"
				margin="0 10px 20px 10px"
				extra={
					<SCardTitleSelector
						value={pair}
						style={{ width: 200 }}
						onSelect={this.handleSelect}
					>
						{pairs.map(p => (
							<Option className="optionMarketTrades" value={p}>
								{p.replace('|', '-')}
							</Option>
						))}
					</SCardTitleSelector>
				}
			>
				<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
					<SCardList noMargin>
						<div className="status-list-wrapper">
							<Table
								dataSource={
									pair
										? trades[pair].map(t => ({
												key: t.transactionHash,
												[CST.TH_TIME]: util.formatTime(t.timestamp),
												[CST.TH_TYPE]:
													t.taker.price === t.maker.price
														? CST.TH_LIMIT
														: CST.TH_MARKET,
												[CST.TH_SIDE]:
													t.taker.side === CST.DB_BID
														? CST.TH_BUY
														: CST.TH_SELL,
												[CST.TH_PX]: {
													price: t.maker.price,
													side:
														t.taker.side === CST.DB_BID
															? 'bid-span'
															: 'ask-span'
												},
												[CST.TH_AMOUNT]: util.formatBalance(t.maker.amount),
												[CST.TH_LINK]: util.getEtherScanTransactionLink(
													t.transactionHash
												)
										  }))
										: []
								}
								pagination={false}
								style={{ width: '100%' }}
								rowClassName={record =>
									record[CST.TH_SIDE] === CST.TH_BUY ? 'titleTable' : 'titleTable'
								}
							>
								<Column
									className="column"
									title={CST.TH_TIME}
									dataIndex={CST.TH_TIME}
								/>
								<Column
									className="column"
									title={CST.TH_SIDE}
									dataIndex={CST.TH_SIDE}
								/>
								<Column
									className="column"
									title={CST.TH_TYPE}
									dataIndex={CST.TH_TYPE}
								/>
								<Column
									className="column"
									render={text => (
										<span className={text.side + ' column'}>{text.price}</span>
									)}
									title={CST.TH_PX}
									dataIndex={CST.TH_PX as any}
								/>
								<Column
									className="column"
									title={CST.TH_AMOUNT}
									dataIndex={CST.TH_AMOUNT}
								/>
								<Column
									title={''}
									dataIndex={CST.TH_LINK}
									render={text => (
										<img
											className="cus-link"
											src={link}
											style={{
												width: '14px',
												height: '14px',
												marginLeft: '10px'
											}}
											onClick={() => window.open(text, '__blank')}
										/>
									)}
								/>
							</Table>
						</div>
					</SCardList>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
