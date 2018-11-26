// import classAIcon from 'images/ClassA_white.png';
// import classBIcon from 'images/ClassB_white.png';
import ethIcon from 'images/ethIcon.png';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import { IEthBalance, ITokenBalance } from 'ts/common/types';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardTitle } from './_styled';
import BalanceInfo from './Balanceinfo';

interface IProps {
	// account: string;
	eth: IEthBalance;
	tokenBalance: ITokenBalance;
}

export default class BalanceCard extends React.Component<IProps> {
	public render() {
		const { eth, tokenBalance } = this.props;
		return (
			<SCard
				title={
					<SCardTitle>
						{CST.TH_BALANCE.toUpperCase()}{' '}
					</SCardTitle>
				}
				width={'790px'}
				margin={'0 0 0 10px'}
			>
				<SDivFlexCenter horizontal={true} padding="0 10px">
					<BalanceInfo
						icon={ethIcon}
						name={CST.TH_ETH}
						value={eth.eth}
					/>
					<BalanceInfo
						icon={ethIcon}
						name={CST.TH_WETH}
						value={eth.weth}
					/>
					<BalanceInfo
						icon={ethIcon}
						name={CST.TH_BALANCE}
						value={tokenBalance.balance}
					/>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
