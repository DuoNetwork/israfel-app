// import { Select } from 'antd';
import { Checkbox } from 'antd';
import { Table } from 'antd';
import link from 'images/icons/linkBlack.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IToken, ITrade } from 'ts/common/types';
import util from 'ts/common/util';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardList, SCardTitle } from './_styled';
const Column = Table.Column;
const CheckboxGroup = Checkbox.Group;

interface IProps {
	tokenBalances: Array<{ code: string; balance: number; address: string }>;
	trades: { [pair: string]: ITrade[] };
	tokens: IToken[];
}

interface IState {
	checkedList: string[];
	indeterminate: boolean;
	checkAll: boolean;
}

export default class TradeHistoryCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			checkedList: [],
			indeterminate: true,
			checkAll: true
		};
	}
	public componentWillReceiveProps(nextProps: IProps) {
		this.setState({
			checkedList:
				this.props.tokenBalances.map(tb => tb.code).length === 8
					? this.state.checkedList
					: nextProps.tokenBalances.map(tb => tb.code)
		});
	}

	private handleChange = (checkedList: string[]) => {
		this.setState({
			checkedList: checkedList,
			checkAll: false
		});
	};

	private onCheckAllChange = (e: any, pair: any) => {
		this.setState({
			checkedList: e.target.checked ? pair : [],
			indeterminate: false,
			checkAll: e.target.checked
		});
	};

	public render() {
		const { tokenBalances, trades, tokens } = this.props;
		const codes = tokenBalances.map(tb => tb.code);
		console.log(codes);
		const codeList = this.state.checkedList;
		// this.state.checkedList.length ? [...this.state.checkedList] : codes;
		const dataSource: any[] = [];
		codeList.forEach(code => {
			const token = tokens.find(to => to.code === code);
			const pair = code + '|' + CST.TH_WETH;
			trades[pair].forEach(t =>
				dataSource.push({
					key: t.transactionHash,
					[CST.TH_TIME]: t.timestamp,
					[CST.TH_PAIR]: t.pair,
					[CST.TH_TYPE]: t.taker.price === t.maker.price ? CST.TH_LIMIT : CST.TH_MARKET,
					[CST.TH_SIDE]: t.taker.side === CST.DB_BID ? CST.TH_BUY : CST.TH_SELL,
					[CST.TH_PX]: util.formatFixedNumber(
						t.maker.price,
						token ? token.precisions[CST.TH_WETH] : 0
					),
					[CST.TH_AMOUNT]: util.formatFixedNumber(
						t.maker.amount,
						token ? token.denomination : 0
					),
					[CST.TH_LINK]: util.getEtherScanTransactionLink(t.transactionHash)
				})
			);
		});
		dataSource.sort((a, b) => -a[CST.TH_TIME] + b[CST.TH_TIME]);
		return (
			<SCard
				title={<SCardTitle>{CST.TH_MARKET + ' ' + CST.TH_TRADES}</SCardTitle>}
				width="740px"
				margin="0 10px 20px 10px"
			>
				<SDivFlexCenter horizontal style={{ marginTop: '5px' }}>
					<SCardList noMargin>
						<div className="status-list-wrapper">
							<Table
								dataSource={dataSource}
								pagination={{ simple: true, pageSize: 6, size: 'small' }}
								style={{ width: 520, height: 250, border: 'none' }}
							>
								<Column
									className="columnAlignLeft"
									title={CST.TH_PAIR}
									dataIndex={CST.TH_PAIR}
									width={165}
									render={text => text.replace('|', '-')}
								/>
								<Column
									className="columnAlignLeft"
									title={CST.TH_TIME}
									width={140}
									dataIndex={CST.TH_TIME}
									render={text => util.formatTime(text)}
								/>
								<Column
									className="antdColumnAlignRight"
									render={(text, record: any) => (
										<span
											className={
												(record[CST.TH_SIDE] === CST.TH_BUY
													? 'bid-span'
													: 'ask-span') + ' column'
											}
										>
											{text}
										</span>
									)}
									title={CST.TH_PX}
									width={100}
									dataIndex={CST.TH_PX as any}
								/>
								<Column
									className="antdColumnAlignRight"
									title={CST.TH_AMOUNT}
									width={100}
									dataIndex={CST.TH_AMOUNT}
								/>
								<Column
									title={''}
									dataIndex={CST.TH_LINK}
									className="imgColumn"
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
					<SCardList noMargin style={{ width: 200 }}>
						<div style={{ borderBottom: '1px solid #E9E9E9' }}>
							<Checkbox
								indeterminate={this.state.indeterminate}
								onChange={(e: any) => this.onCheckAllChange(e, codes)}
								checked={this.state.checkAll}
								// onChange={() => this.handleChange([])}
							>
								{this.state.checkAll ? 'Clear All' : 'Select All'}
							</Checkbox>
						</div>
						<br />
						<CheckboxGroup
							style={{ padding: '10, 5' }}
							options={codes}
							value={this.state.checkedList}
							onChange={e => this.handleChange(e.map(i => i.toString()))}
						/>
					</SCardList>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
