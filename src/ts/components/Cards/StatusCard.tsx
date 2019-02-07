import { Table } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import util from 'ts/common/util';
import { IStatus } from '../../../../../israfel-common/src';
import { SCard, SCardTitle, STableWrapper } from './_styled';

const { Column } = Table;

interface IProps {
	status: IStatus[];
}

export default class StatusCard extends React.Component<IProps> {
	public render() {
		const { status } = this.props;
		const dataSource = status.map(s => ({
			key: s.tool + s.pair + s.hostname,
			[CST.TH_PROCESS]: s.tool,
			[CST.TH_PAIR]: s.pair.replace('|', '-'),
			[CST.TH_UPDATED]: util.convertUpdateTime(s.updatedAt),
			[CST.TH_HOSTNAME]: s.hostname,
			[CST.TH_INFO]: s.count
		}));
		dataSource.sort((a, b) => a.key.localeCompare(b.key));
		return (
			<SCard
				title={<SCardTitle>{CST.TH_STATUS}</SCardTitle>}
				width="100%"
				margin="20px 0 0 0"
				inlinetype="table"
			>
				<STableWrapper>
					<Table dataSource={dataSource} pagination={false}>
						{[
							CST.TH_PROCESS,
							CST.TH_PAIR,
							CST.TH_UPDATED,
							CST.TH_HOSTNAME,
							CST.TH_INFO
						].map(th => (
							<Column title={th} dataIndex={th} key={th} />
						))}
					</Table>
				</STableWrapper>
			</SCard>
		);
	}
}
