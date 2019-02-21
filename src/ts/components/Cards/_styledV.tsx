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
		padding: 10px 4%;
		transition: all, 0.3s;
	}
	.bet-card-close {
		top: 209px;
		opacity: 0;
		pointer-events: none;
	}
	.bet-card-open {
		top: 179px;
		opacity: 1;
		background: #f1f1f1;
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
		z-index: 0
	}
	div {
		z-index: 1;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all, .3s;
		img {
			width: 24px;
		}
	}
	.down-inactive {
		background: #d3d3d3;
	}
	.down-active {
		background: ${ColorStyles.ThemeRed};
		box-shadow: 0 2px 5px 0 rgba(0,0,0,.3);
		transform: scale(1.05);
	}
	.up-inactive {
		background: #d3d3d3;
	}
	.up-active {
		background: ${ColorStyles.ThemeGreen};
		box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
		transform: scale(1.05);
	}
`;

export const SBetInfoWrapper = styled.div`
	padding: 20px 0 0 0;
	h3 {
		margin: 0;
		color: ${ColorStyles.ThemeTextAlpha};
		font-weight: 400;
		font-size: 16px;
		b {
			color: ${ColorStyles.ThemeText};
		}
	}
	.price-wrapper {
		padding: 8px 0;
		font-size: 26px;
		font-weight: 500;
		transition: all, .2s;
		span {
			color: ${ColorStyles.ThemeTextAlpha};
			font-size: 18px;
			font-weight: 400;
		}
	}
	.count-down {
		padding: 8px 0;
		font-size: 48px;
		text-align: center;
		font-weight: 500;
		transition: all, .2s;
	}
	.above {
		color: ${ColorStyles.ThemeGreen};
	}
	.below {
		color: ${ColorStyles.ThemeRed};
	}
`;

export const SSliderWrapper = styled.div`
	.slider-wrapper {
		width: 80%;
		margin: 20px 0;
	}
`;
