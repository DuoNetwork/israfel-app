import { notification } from 'antd';
import React from 'react';
import util from 'ts/common/util';
import { SButton } from '../Cards/_styled';

interface IProps {
	level: string;
	title: string;
	message: string;
	transactionHash: string;
	clear: () => any;
}

export default class Notification extends React.Component<IProps> {
	public shouldComponentUpdate(nextProps: IProps) {
		const { level, title, message, transactionHash, clear } = nextProps;

		if (!message) return false;

		((notification as any)[level] || notification.open)({
			message: title || level.toUpperCase(),
			description: message,
			duration: level === 'error' ? 0 : 5,
			btn: transactionHash ? (
				<SButton
					onClick={() =>
						window.open(util.getEtherScanTransactionLink(transactionHash), '_blank')
					}
				>
					View Transaction on Etherscan
				</SButton>
			) : (
				undefined
			)
		});
		clear();

		return false;
	}

	public render() {
		return null;
	}
}
