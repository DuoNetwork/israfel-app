import eth from 'images/ethIconB.png';
import down from 'images/vivaldi/downW.png';
import graph from 'images/vivaldi/GraphCard.png';
import placeHolder from 'images/vivaldi/Mobile.png';
import up from 'images/vivaldi/upW.png';
import user from 'images/vivaldi/user.png';
import moment from 'moment';
import * as React from 'react';
import Countdown from 'react-countdown-now';
import MediaQuery from 'react-responsive';
import util from 'ts/common/util';
import {
	SDesCard,
	SDivFlexCenter,
	SGraphCard,
	SInfoCard,
	SPayoutCard,
	SUserCount,
	SVHeader
} from './_styledV';
import VivaldiBetCard from './Cards/VivaldiBetCard';

//interface IProps {}
interface IState {
	openBetCard: boolean;
	entryTag: number;
}
export default class Vivaldi extends React.PureComponent<{}, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			openBetCard: false,
			entryTag: 0
		};
	}

	public handleBetCard = (entry?: number) => {
		this.setState({
			openBetCard: !this.state.openBetCard,
			entryTag: entry ? entry : this.state.entryTag
		});
	};

	public handleBetCardTag = (tag: number) => {
		this.setState({
			entryTag: tag
		});
	};

	public render() {
		const { openBetCard, entryTag } = this.state;
		const Endtime = '2019-2-21 17:56';
		const renderer = ({ hours, minutes, seconds, completed }: any) => {
			if (completed) return <span>Result Settling</span>;
			else
				return (
					<span>
						{util.fillZero(hours)}:{util.fillZero(minutes)}:{util.fillZero(seconds)}
					</span>
				);
		};
		return (
			<div>
				<MediaQuery minDeviceWidth={900}>
					<header>
						Vivaldi <span>Prediction Market</span>
					</header>
					<div className="img-wrapper">
						<img src={placeHolder} />
						<h3>
							Please use mobile phone to access to <b>Vivaldi</b>.
						</h3>
					</div>
				</MediaQuery>
				<MediaQuery maxDeviceWidth={899}>
					<SVHeader>
						<div className="title">
							ETH
							<img src={eth} />
						</div>
						<div className="logo-wrapper">
							<b>Vivaldi</b>
							<b>Prediction</b>
							<b>Market</b>
						</div>
					</SVHeader>
					<SInfoCard>
						<div className="info-bar">
							<div className="info-bar-left">
								<div className="info-title">Ethereum</div>
								<div className="info-price">$150.00</div>
							</div>
							{/* {<div className='info-bar-right'>
							Graph
						</div>} */}
						</div>
						<div className="subtitle-bar">
							<span className="updown-button">UP</span>
							<span className="change-button">$10.23 (10.23%)</span>
							<span className="game-button">current game</span>
						</div>
					</SInfoCard>
					<SGraphCard>
						<img src={graph} />
					</SGraphCard>
					<SDesCard>
						<div>
							Where do you think the price of <b>ETH</b> is going in
						</div>
						<div className="count-down">
							<Countdown date={moment(Endtime).valueOf()} renderer={renderer} />
						</div>
					</SDesCard>
					<SDivFlexCenter horizontal padding="12px 10%">
						<SUserCount>
							<div>
								<img className="user-img" src={user} />
								123
							</div>
							<div className="ud-img down-img" onClick={() => this.handleBetCard(1)}>
								<img src={down} />
							</div>
						</SUserCount>
						<SUserCount>
							<div className="ud-img up-img" onClick={() => this.handleBetCard(2)}>
								<img src={up} />
							</div>
							<div>
								<img className="user-img" src={user} />
								123
							</div>
						</SUserCount>
					</SDivFlexCenter>
					<SPayoutCard>
						<div className="title">My Payouts</div>
						<div className="section">
							<h3>Current Game</h3>
							<div className="row">
								<div className="col1">
									<h4 className="col-title"># OF ETH SPENT</h4>
									<h4 className="col-content">39.68</h4>
								</div>
								<div className="col2">
									<h4 className="col-title">EXPECTED RETURN</h4>
									<h4 className="col-content">67.88</h4>
								</div>
								<div className="col3">
									<h4 className="col-content increase">+98.44%</h4>
								</div>
							</div>
						</div>
						<div className="section">
							<h3>Previous Game</h3>
							<div className="row">
								<div className="col1">
									<h4 className="col-title"># OF ETH SPENT</h4>
									<h4 className="col-content">39.68</h4>
								</div>
								<div className="col2">
									<h4 className="col-title">EXPECTED RETURN</h4>
									<h4 className="col-content">27.88</h4>
								</div>
								<div className="col3">
									<h4 className="col-content decrease">-23.44%</h4>
								</div>
							</div>
						</div>
					</SPayoutCard>
					<VivaldiBetCard
						cardOpen={openBetCard}
						endTime={Endtime}
						entryTag={entryTag}
						downdownPrice={140}
						downPrice={145}
						upPrice={155}
						upupPrice={160}
						onCancel={this.handleBetCard}
						onTagChange={this.handleBetCardTag}
					/>
				</MediaQuery>
			</div>
		);
	}
}
