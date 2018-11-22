import { Table } from 'antd';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IStatus } from 'ts/common/types';
import util from 'ts/common/util';
import { SCard, SCardTitle, STableWrapper } from './_styled';

const { Column } = Table;

interface IProps {
	status: IStatus[];
}

export default class StatusCard extends React.Component<IProps> {
	public render() {
		const { status } = this.props;
		return (
			<SCard
				title={<SCardTitle>{CST.TH_STATUS.toUpperCase()}</SCardTitle>}
				width="100%"
				margin="0 0px 0 0"
				inlinetype="table"
			>
				<STableWrapper>
					<Table
						dataSource={status.map(s => ({
							key: s.tool + s.hostname,
							[CST.TH_PROCESS]: s.tool,
							[CST.TH_UPDATED]: util.convertUpdateTime(s.updatedAt),
							[CST.TH_HOSTNAME]: s.hostname,
							[CST.TH_INFO]: s.count
						}))}
						pagination={false}
					>
						{[CST.TH_PROCESS, CST.TH_UPDATED, CST.TH_HOSTNAME, CST.TH_INFO].map(th => (
							<Column title={th} dataIndex={th} key={th} />
						))}
					</Table>
				</STableWrapper>
			</SCard>
		);
	}
}
