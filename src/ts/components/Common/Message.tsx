import { notification } from 'antd';
import React from 'react';
import { DB_LIVE } from 'ts/common/constants';
import { SButton } from '../Cards/_styled';

interface IProps {
	level: string;
	message: string;
	transactionHash: string;
}

export default class Message extends React.Component<IProps> {
	public shouldComponentUpdate(nextProps: IProps) {
		const { level, message, transactionHash } = nextProps;

		if (!message) return false;

		((notification as any)[level] || notification.open)({
			message: level.toUpperCase(),
			description: message,
			duration: 0,
			btn: transactionHash ? (
				<SButton
					onClick={() =>
						window.open(
							`https://${
								__ENV__ === DB_LIVE ? '' : 'kovan.'
							}etherscan.io/tx/${transactionHash}`,
							'_blank'
						)
					}
				>
					View Transaction on Etherscan
				</SButton>
			) : (
				undefined
			)
		});

		return false;
	}

	public render() {
		return null;
	}
}
