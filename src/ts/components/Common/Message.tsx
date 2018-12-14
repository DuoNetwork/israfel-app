import { notification } from 'antd';
import React from 'react';

interface IProps {
	level: string;
	message: string;
}

export default class Message extends React.Component<IProps> {
	public shouldComponentUpdate(nextProps: IProps) {
		const { level, message } = nextProps;

		if (!level || !message)
			return false;

		(notification as any)[level].open({
			message: level.toUpperCase(),
			description: message,
			duration: 3
		});

		return false;
	}

	public render() {
		return null;
	}
}
