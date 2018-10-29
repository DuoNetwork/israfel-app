import duoIcon from 'images/DUO_icon.png';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { SDivFlexCenter, SHeader } from './_styled';

export interface IProps {
	location: object;
}

export default class Header extends React.PureComponent<IProps> {
	public render() {
		return (
			<SHeader>
				<SDivFlexCenter horizontal width="100%" padding="0 20px">
					<div className="icon-wrapper">
						<Link to={'/'} className="log-out-button">
							<img src={duoIcon} />
						</Link>
					</div>
				</SDivFlexCenter>
			</SHeader>
		);
	}
}
