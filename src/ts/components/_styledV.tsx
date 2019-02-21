import styled from 'styled-components';
import { ColorStyles } from 'ts/common/styles';

export interface IDivFlexCenterProps {
	width?: string;
	height?: string;
	center?: boolean;
	noJust?: boolean;
	horizontal?: boolean;
	marginBottom?: string;
	marginTop?: string;
	padding?: string;
	paddingLeft?: string;
	paddingRight?: string;
	paddingTop?: string;
	paddingBottom?: string;
	rowInv?: boolean;
}

export const SDivFlexCenter = styled.div`
	display: flex;
	width: ${(props: IDivFlexCenterProps) => props.width};
	height: ${(props: IDivFlexCenterProps) => props.height};
	flex-direction: ${(props: IDivFlexCenterProps) => (props.horizontal ? (props.rowInv ? 'row-reverse' : 'row') : 'column')};
	justify-content: ${(props: IDivFlexCenterProps) => (props.noJust ? null : props.center ? 'center' : 'space-between')};
	padding: ${(props: IDivFlexCenterProps) => (props.padding)};
	padding-left: ${(props: IDivFlexCenterProps) => (props.padding ? null : props.paddingLeft)};
	padding-right: ${(props: IDivFlexCenterProps) => (props.padding ? null : props.paddingRight)};
	padding-top: ${(props: IDivFlexCenterProps) => (props.padding ? null : props.paddingTop)};
	padding-bottom: ${(props: IDivFlexCenterProps) => (props.padding ? null : props.paddingBottom)};
	margin-bottom: ${(props: IDivFlexCenterProps) => (props.marginBottom)};
	margin-top: ${(props: IDivFlexCenterProps) => (props.marginTop)};
`;

export const SVHeader = styled.div`
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 4%;
	border-bottom: 1px solid ${ColorStyles.BorderBlack1};
	.title {
		font-size: 18px;
		font-weight: 500;
		color: ${ColorStyles.ThemeTextAlpha};
		display: flex;
		align-items: center;
		img {
			margin-left: 2px;
			height: 22px;
			width: 22px;
			opacity: 0.7;
		}
	}
	.logo-wrapper {
		display: flex;
		flex-direction: column;
		font-size: 12px;
		b {
			color: ${ColorStyles.TitlePM};
		}
		b:first-child {
			color: ${ColorStyles.TitleV};
		}
	}
`;

export const SInfoCard = styled.div`
	padding: 10px 4%;
	.info-bar {
		width: 100;
		display: flex;
		justify-content: space-between;
		.info-bar-left {
			font-size: 30px;
			font-weight: 500;
			line-height: 36px;
			.info-title {
				color: ${ColorStyles.ThemeTextAlpha};
			}
			.info-price {
				color: ${ColorStyles.ThemeText};
			}
		}
		.info-bar-right {
			height: 72px;
			width: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px dashed ${ColorStyles.BorderBlack3};
		}
	}
	.subtitle-bar {
		padding: 8px 0 4px 0;
		font-size: 12px;
		.updown-button {
			padding: 2px 8px;
			border-radius: 2px;
			background: ${ColorStyles.ThemeGreen};
			color: #fff;
			margin-right: 8px;
		}
		.change-button {
			color: ${ColorStyles.ThemeGreen};
			margin-right: 8px;
		}
		.game-button {
			color: ${ColorStyles.ThemeText};
		}
	}
`;

export const SGraphCard = styled.div`
	border-top: 1px dashed ${ColorStyles.BorderBlack2};
	padding: 20px 4% 10px;
	img {
		width: 100%;
		height: 180px;
	}
`;

export const SDesCard = styled.div`
	padding: 10px 4%;
	font-size: 14px;
	color: ${ColorStyles.ThemeTextAlpha};
	b {
		color: ${ColorStyles.ThemeText};
	}
	.count-down {
		background: rgba(247, 252, 255);
		margin-top: 4px;
		padding: 5px 0;
		width: 100%;
		text-align: center;
		font-size: 36px;
		font-weight: 500;
		color: ${ColorStyles.TitlePM};
	}
`;

export const SJoinButton = styled.div`
	font-size: 14px;
	color: #fff;
	background: ${ColorStyles.TitlePM};
	border: 1px solid ${ColorStyles.TitlePM};
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	padding: 8px 12px;
	text-align: center;
	transition: all, 0.3s;
	display: flex;
	justify-content: center;
	align-items: center;
	img {
		width: 12px;
		height: 14px;
		margin-right: 4px;
	}
	&:hover {
		color: ${ColorStyles.TitlePM};
		background: transparent;
	}
`;
export const SUserCount = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px 0;
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 10px;
		color: ${ColorStyles.ThemeTextAlpha};
		font-weight: 500;
		font-size: 16px;
	}
	.user-img {
		width: 18px;
		height: 18px;
		margin-right: 4px;
	}
	.ud-img {
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 48px;
		height: 43px;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
		transition: all, .3s;
		img{
		width: 22px;
		height: 14px;
		}
	}
	.up-img {
		background: ${ColorStyles.ThemeGreen};
		padding-bottom: 5px;
	}
	.down-img {
		background: ${ColorStyles.ThemeRed};
		padding-top: 5px;
	}
`;

export const SPayoutCard = styled.div`
	padding: 10px 6% 10px 4%;
	.title {
		color: ${ColorStyles.ThemeTextAlpha};
		font-size: 22px;
		font-weight: 500;
	}
	.section {
		h3 {
			color: ${ColorStyles.ThemeTextAlpha};
			font-size: 16px;
			font-weight: 500;
			margin: 8px 0 0 0;
		}
	}
	.row {
		display: flex;
		justify-content: space-between;
		h4 {
			margin: 4px 0;
		}
		.col-title {
			font-size: 12px;
			font-weight: 300;
			color: ${ColorStyles.ThemeTextAlpha};
		}
		.col-content {
			font-size: 14px;
			font-weight: 500;
			color: ${ColorStyles.ThemeText};
			text-align: right;
		}
		.col3 {
			display: flex;
			flex-direction: column-reverse;
		}
		.increase {
			color: ${ColorStyles.ThemeGreen} !important;
		}
		.decrease {
			color: ${ColorStyles.ThemeRed} !important;
		}
	}
`;
