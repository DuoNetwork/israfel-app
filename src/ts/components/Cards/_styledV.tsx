import styled from 'styled-components';
import { ColorStyles } from 'ts/common/styles';

export const SVBetCard = styled.div`
	position: absolute;
	width: 100%;
	top: 0;
	.card-wrapper {
		position: absolute;
		width: 92%;
		height: 427px;
		padding: 15px 4%;
		transition: all, 0.3s;
	}
	.bet-card-close {
		top: 194px;
		opacity: 0;
		pointer-events: none;
	}
	.bet-card-open {
		top: 179px;
		opacity: 1;
		background: #fff;
	}
`;

export const STagWrapper = styled.div`
	position: relative;
	display: flex;
	justify-content: space-around;
	&::before {
		content: '';
		position: absolute;
		top: calc(50% - 1px);
		width: 100%;
		border-bottom: 1px dashed ${ColorStyles.BorderBlack2};
		z-index: 0;
	}
	div {
		z-index: 1;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all, 0.3s;
		img {
			width: 24px;
		}
	}
	.down-inactive {
		background: #d3d3d3;
	}
	.down-active {
		background: ${ColorStyles.ThemeRed};
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
		transform: scale(1.05);
	}
	.up-inactive {
		background: #d3d3d3;
	}
	.up-active {
		background: ${ColorStyles.ThemeGreen};
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
		transform: scale(1.05);
	}
`;

export const SBetInfoWrapper = styled.div`
	padding: 20px 0 0 0;
	h3 {
		margin: 0;
		color: ${ColorStyles.ThemeTextAlpha};
		font-weight: 400;
		font-size: 18px;
		b {
			color: ${ColorStyles.ThemeText};
		}
	}
	.price-wrapper {
		padding: 8px 0;
		font-size: 26px;
		font-weight: 500;
		transition: all, 0.2s;
		span {
			color: ${ColorStyles.ThemeTextAlpha};
			font-size: 18px;
			font-weight: 400;
		}
	}
	.count-down {
		padding: 8px 0;
		font-size: 54px;
		text-align: center;
		font-weight: 500;
		transition: all, 0.2s;
	}
	.above {
		color: ${ColorStyles.ThemeGreen};
	}
	.below {
		color: ${ColorStyles.ThemeRed};
	}
`;

export const SSliderWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	.slider-wrapper {
		width: 70%;
		margin: 8px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid ${ColorStyles.BorderBlack3};
		border-radius: 3px;
		padding: 2px;
		.rc-slider-rail,
		.rc-slider-track {
			height: 10px;
			top: 2px;
			border-radius: 2px;
			transition: background-color 0.3s;
		}
		.rc-slider-rail {
			background-color: #f2f3f4;
		}
		.rc-slider-handle {
			border: none;
			margin-left: -11px;
			margin-top: -10px;
			width: 24px;
			height: 24px;
			transition: background-color 0.3s;
		}
		.rc-slider-handle:active {
			box-shadow: none;
		}
		.above {
			.rc-slider-track {
				background-color: ${ColorStyles.ThemeGreenAlpha};
			}
			.rc-slider-handle {
				background-color: ${ColorStyles.ThemeGreen};
			}
		}
		.below {
			.rc-slider-track {
				background-color: ${ColorStyles.ThemeRedAlpha};
			}
			.rc-slider-handle {
				background-color: ${ColorStyles.ThemeRed};
			}
		}
	}
	.des-wrapper-ph {
		width: 100%;
		height: 136px;
		font-size: 20px;
		font-weight: 500;
		color: ${ColorStyles.ThemeTextAlpha};
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.des-wrapper {
		width: 100%;
		padding: 10px 0;
		.des-row {
			padding: 5px 0;
			display: flex;
			font-size: 18px;
			color: ${ColorStyles.ThemeTextAlpha};
			align-items: flex-end;
			div:first-child {
				width: 23%;
				margin-bottom: 2px;
			}
			div:nth-child(2) {
				width: 25%;
				font-size: 26px;
				font-weight: 500;
				color: ${ColorStyles.ThemeText};
				text-align: right;
				margin-right: 8px;
			}
			div:nth-child(3) {
				width: 12%;
				margin-bottom: 2px;
			}
			div:nth-child(4) {
				font-weight: 500;
				color: ${ColorStyles.ThemeText};
				margin-bottom: 2px;
			}
		}
	}
`;

export const SCardButtonWrapper = styled.div`
	position: relative;
	display: flex;
	justify-content: space-around;
	padding: 20px 8%;
	&::before {
		content: '';
		position: absolute;
		top: calc(50% - 1px);
		width: 100%;
		border-bottom: 1px dashed ${ColorStyles.BorderBlack2};
		z-index: 0;
	}
	.button {
		z-index: 1;
		width: 24%;
		padding: 4px 8px;
		border: 1px solid;
		border-radius: 4px;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		transition: all 0.3s;
		img {
			width: 22px;
			height: 22px;
			margin-left: 4px;
		}
	}
	.button-disabled{
		background:  #B3B9BA !important;
		pointer-events: none;
	}
	.aboveC {
		border-color: ${ColorStyles.ThemeGreen};
		color: ${ColorStyles.ThemeGreen};
		background: #fff;
	}
	.belowC {
		border-color: ${ColorStyles.ThemeRed};
		color: ${ColorStyles.ThemeRed};
		background: #fff;
	}
	.above {
		border-color: transparent;
		background: ${ColorStyles.ThemeGreen};
		color: #fff;
	}
	.below {
		border-color: transparent;
		background: ${ColorStyles.ThemeRed};
		color: #fff;
	}
`;
