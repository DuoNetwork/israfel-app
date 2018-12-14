import * as React from 'react';
import { IStatus } from 'ts/common/types';
import StatusCard from '../Cards/StatusCard';

interface IProps {
	status: IStatus[];
}

export default class Status extends React.Component<IProps> {
	public componentDidMount() {
		document.title = 'DUO | Status';
	}

	public render() {
		const { status } = this.props;
		return (
			<StatusCard status={status} />
		);
	}
}
