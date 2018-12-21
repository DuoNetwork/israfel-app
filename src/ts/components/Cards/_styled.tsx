import { Button, Card, Radio, Select, Slider } from 'antd';
import styled, { injectGlobal } from 'styled-components';
import { ColorStyles } from 'ts/common/styles';

const RadioGroup = Radio.Group;

export interface ICardProps {
	width?: string;
	margin?: string;
	inlinetype?: string;
	noBodymargin?: boolean;
}

export const SCard = styled(Card)`
	overflow: hidden !important;
	max-width: 1200px;
	width: ${(props: ICardProps) => props.width} !important;
	margin: ${(props: ICardProps) => props.margin} !important;
	display: ${(props: ICardProps) => (props.inlinetype ? 'inline-table' : '')} !important;
	background: ${ColorStyles.CardBackground} !important;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2) !important;
	border-radius: 4px !important;
	border: none !important;
	& > .ant-card-head {
		background: ${ColorStyles.MainColor} !important;
		border-bottom: none !important;
		padding: 0 15px !important;
		min-height: 40px;
		height: 40px;
		.ant-card-head-wrapper {
			.ant-card-head-title {
				padding: 10px 0 !important;
			}
			.ant-card-extra {
				height: 40px;
				align-items: center;
    			display: flex;
			}
		}
	}
	& > .ant-card-body {
		padding: ${(props: ICardProps) => (props.noBodymargin ? '0' : '10px')} !important;
	}
`;

export const SCardTitle = styled.div`
	color: ${ColorStyles.TextWhite};
	font-family: 'Roboto', 'Microsoft YaHei';
	font-weight: 500;
	letter-spacing: 1px;
	font-size: 16px;
	line-height: 20px;
`;

export const SCardTitleSelector = styled(Select as any)`
	.ant-select-selection {
		border-radius: 0;
		color: ${ColorStyles.TextBlackAlphaL};
		background-color: transparent;
		border: 1px solid;
		border-color: ${ColorStyles.BorderWhite1};
		font-size: 10px;
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 400;
		letter-spacing: 0;
		span {
			color: ${ColorStyles.TextBlackAlphaLLL};
		}
	}
	.ant-select-selection:focus {
		-webkit-box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.1);
		box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.1);
	}
`;
export interface ISButtonProps {
	width?: string;
	disable?: boolean;
}

export const SButton = styled.button`
	pointer-events: ${(props: ISButtonProps) => (props.disable ? 'none' : 'auto')};
	cursor: pointer;
	outline: none;
	height: 30px;
	width: ${(props: ISButtonProps) => (props.width ? props.width : '100%')};
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid ${ColorStyles.MainColor};
	border-radius: 2px;
	color: ${ColorStyles.MainColor};
	background-color: #fff;
	font-size: 14px;
	transition: all 0.2s;
	&:hover {
		background: ${ColorStyles.MainColor};
		color: ${ColorStyles.TextWhite};
		box-shadow: 0 0 4px 1px ${ColorStyles.MainColorShadow};
	}
`;

export interface ICardPriceTagProps {
	mobile?: boolean;
	locale?: string;
}
export const SCardPriceTag = styled.div`
	height: 100px;
	width: ${(props: ICardPriceTagProps) => (props.mobile ? '100%' : '155px')};
	position: relative;
	margin-top: 10px;
	border: 1px dashed;
	border-color: ${ColorStyles.BorderWhite1};
	overflow: hidden;
	padding-top: 10px;
	.bg-logo {
		height: 100px;
		width: 100px;
		position: absolute;
		left: ${(props: ICardPriceTagProps) => (props.mobile ? '' : '-35px')};
		right: ${(props: ICardPriceTagProps) => (props.mobile ? '-15px' : '')};
		top: 10px;
	}
	.bg-logo > img {
		height: 100%;
		width: 100%;
		opacity: 0.05;
		pointer-events: none;
	}
	.tag-title {
		width: 90px;
		margin-left: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		img {
			width: 10px;
			height: 10px;
			margin-left: 6px;
			opacity: 0.6;
		}
	}
	.tag-title > a {
		margin: 0;
	}
	.tag-title > a,
	.tag-title > h3 {
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 12px;
		color: ${ColorStyles.TextBlackAlphaL};
		margin: 0;
		z-index: 99;
		text-decoration: none;
	}
	.tag-content {
		width: 120px;
		margin-left: 20px;
		margin-top: 10px;
		.tag-subtext {
			font-size: '12px';
			display: flex;
			flex-direction: row;
			color: ${ColorStyles.TextBlackAlphaL};
		}
	}
	.tag-price {
		color: white;
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 16px;
		margin-bottom: 5px;
	}
	.tag-unit {
		margin-left: 2px;
		color: ${ColorStyles.TextBlackAlphaL};
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 10px;
		margin-top: 5.5px;
	}
	.tag-price-1 {
		color: ${ColorStyles.TextTokenA};
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 16px;
		margin-bottom: 5px;
	}
	.tag-price-2 {
		color: ${ColorStyles.TextTokenB};
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 16px;
		margin-bottom: 5px;
	}
	.tag-price-3 {
		color: white;
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 12px;
		margin-bottom: 5px;
		margin-left: 6px;
		width: 60px;
		text-align: right;
	}
	.tag-unit-1,
	.tag-unit-2 {
		margin-left: 2px;
		color: ${ColorStyles.TextBlackAlphaL};
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 10px;
		margin-top: 5.5px;
	}
	.tag-unit-3 {
		color: ${ColorStyles.TextBlackAlphaL};
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 10px;
	}
`;

export interface ICardAssetTagProps {
	value: number;
}

export const SCardAssetTag = styled.div`
	height: 100px;
	width: 140px;
	position: relative;
	margin-top: 10px;
	border: 1px dashed;
	border-color: ${ColorStyles.BorderWhite1};
	overflow: hidden;
	padding-top: 10px;
	.bg-logo {
		height: 100px;
		width: 100px;
		position: absolute;
		left: -35px;
		top: 10px;
	}
	.bg-logo > img {
		height: 100%;
		width: 100%;
		opacity: 0.05;
		pointer-events: none;
	}
	.tag-title {
		width: 90px;
		margin-left: 15px;
	}
	.tag-title > h3 {
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 12px;
		color: ${ColorStyles.TextBlackAlphaL};
		margin: 0;
	}
	.tag-content {
		width: 140px;
		margin-left: 15px;
		margin-top: 10px;
	}
	.tag-subtext {
		color: ${ColorStyles.TextBlackAlphaL};
		font-size: 10px;
	}
	.tag-price {
		color: ${ColorStyles.TextBlackAlpha};
		font-family: 'Roboto', 'Microsoft YaHei';
		font-weight: 500;
		letter-spacing: 1px;
		font-size: 18px;
	}
`;

export const SCardExtraDiv = styled.div`
	color: ${ColorStyles.TextBlackAlphaLL};
	font-size: 10px;
	padding-right: 10px;
	line-height: 24px;
`;

export const SCardExtraDivSolid = styled.div`
	span {
		color: ${ColorStyles.TextBlackAlphaL};
		font-size: 12px;
		padding-right: 10px;
		line-height: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		img {
			margin-left: 4px;
			width: 10px;
			height: 10px;
		}
	}
`;

export interface ICardExtraProps {
	color?: string;
}

export const SCardExtendExtraDiv = styled.div`
	font-family: 'Roboto', 'Microsoft YaHei';
	color: ${ColorStyles.TextBlackAlphaLL};
	font-size: 10px;
	padding-right: 10px;
	line-height: 24px;
	& > .extend-extra-wrapper {
		padding: 0 10px;
		border: 1px dashed;
		border-color: ${(props: ICardExtraProps) =>
			props.color ? ColorStyles.TextRedAlphaLL : ColorStyles.BorderWhite3};
		display: flex;
		flex-direction: row;
		.tag-content {
			text-decoration: none;
			color: ${(props: ICardExtraProps) =>
				props.color ? props.color : ColorStyles.TextBlackAlphaL};
			overflow: hidden;
			display: flex;
			flex-direction: row-reverse;
			margin-left: 8px;
			max-width: 42px;
			transition: max-width 0.3s ease-in-out, margin-left 0.3s ease-in-out;
			-webkit-transition: max-width 0.3s ease-in-out, margin-left 0.3s ease-in-out;
		}
	}
	& > .extend-extra-wrapper:hover > .tag-content {
		margin-left: 8px;
		max-width: ${(props: ICardExtraProps) => (props.color ? '60px' : '300px')};
	}
`;

export const SCardRadioExtraDiv = styled.div`
	font-family: 'Roboto', 'Microsoft YaHei';
	color: ${ColorStyles.TextBlackAlphaLL};
	font-size: 10px;
	line-height: 24px;
	& > .extend-extra-wrapper {
		display: flex;
		flex-direction: row;
	}
	& > .true {
		padding-right: 10px;
	}
	.ant-radio-group {
		font-size: 10px;
		font-weight: 400;
	}
`;

export const SRadioGroup = styled(RadioGroup as any)`
	margin-left: 8px;
	.ant-radio-button-wrapper:first-child,
	.ant-radio-button-wrapper:last-child {
		border-radius: 0;
	}
	.ant-radio-button-wrapper:last-child {
		border-left: 0;
	}
	.ant-radio-button-wrapper {
		padding: 0 12px;
		border: 1px dashed;
		border-color: ${ColorStyles.BorderWhite2};
		color: ${ColorStyles.TextBlackAlphaLLL};
		background: ${ColorStyles.ButtonRadioUnchekedBG};
	}
	.ant-radio-button-wrapper-checked {
		border: 1px solid;
		border-color: ${ColorStyles.BorderWhite4};
		color: ${ColorStyles.TextBlackAlphaL};
		background: ${ColorStyles.ButtonRadioChekedBG};
		box-shadow: ${() => '-1px 0 0 0 ' + ColorStyles.BorderWhite6};
	}
`;

export interface ICardListProps {
	noMargin?: boolean;
	fixWidth?: boolean;
	width?: string;
	noUlBorder?: boolean;
	noLiBorder?: boolean;
}
export const SCardList = styled.div`
	width: ${(props: ICardListProps) => (props.width ? props.width : '100%')};
	.status-list-wrapper {
		width: 100%;
		overflow: hidden;
	}
	.status-list-wrapper > ul:last-child {
		margin: ${(props: ICardListProps) => (props.noMargin ? '0 0 0 0 !important' : '10px 0')};
	}
	.status-list-wrapper > ul {
		transition: all 0.3s;
		list-style: none;
		margin: 10px 0;
		padding: 0;
		border: ${(props: ICardListProps) => (props.noUlBorder ? 'none' : '1px solid')};
		border-color: ${ColorStyles.BorderWhite1};
		li:nth-child(even) {
			background-color: ${ColorStyles.ListHighlight};
		}
		.no-bg {
			background-color: transparent !important;
			padding: 0 5px 0 3px;
			overflow: hidden;
			position: relative;
		}
		.error-line {
			display: flex;
			flex-direction: row-reverse;
			padding-top: 5px;
			color: ${ColorStyles.TextRedAlpha};
		}
		.block-title {
			font-weight: 600;
			color: ${ColorStyles.TextBlackAlphaL};
			margin-bottom: 5px;
			.last-reset-title {
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.last-reset-title-span {
					color: ${ColorStyles.TextBlackAlphaLL};
					font-size: 10px;
				}
			}
		}
		li {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 5px;
			border-bottom: ${(props: ICardListProps) =>
				props.noLiBorder ? 'none' : `1px solid ${ColorStyles.BorderWhite1}`};
			.title {
				color: ${ColorStyles.TextBlackAlpha};
			}
			.status {
				color: ${ColorStyles.TextBlackAlpha};
			}
			.content {
				color: ${ColorStyles.TextBlack};
			}
			.des {
				color: ${ColorStyles.TextBlackAlphaL};
				font-size: 12px;
			}
			.percent-button {
				outline: none;
				cursor: pointer;
				font-family: 'Roboto', 'Microsoft YaHei';
				background-color: transparent;
				color: ${ColorStyles.TextBlackAlphaLL};
				border: 1px dashed;
				border-color: ${ColorStyles.BorderWhite2};
				font-size: 10px;
				height: 24px;
				width: 40px;
				transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;
			}
			.percent-button:hover {
				color: ${ColorStyles.TextBlackAlphaL};
				border-color: ${ColorStyles.BorderWhite4};
				background-color: ${ColorStyles.ButtonHoverWhite1};
			}
			.align-right {
				width: 100%;
				color: ${ColorStyles.TextBlackAlphaLL};
				font-size: 12px;
				text-align: right;
			}
			.default-button {
				cursor: pointer;
				font-size: 10px;
				color: ${ColorStyles.TextBlackAlphaLL};
				border: 1px dashed;
				border-color: ${ColorStyles.BorderWhite2};
				padding: 0 5px;
				transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;
			}
			.default-button:hover {
				color: ${ColorStyles.TextBlackAlpha};
				border-color: ${ColorStyles.BorderWhite6};
			}
		}
		.waring-expand-button {
			cursor: pointer;
			color: ${ColorStyles.TextBlackAlpha};
			font-size: 12px;
			transition: all 0.2s;
			span {
				display: flex;
			}
		}
		.waring-expand-button:hover {
			background: ${ColorStyles.MainColorShadow};
		}
		li:last-child {
			border-bottom: none;
		}
		.input-line {
			padding: 5px 5px;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 5px;
			transition: all 0.3s;
		}
		.input-disabled {
			pointer-events: none;
			opacity: 0.2 !important;
		}
		.description {
			width: 100%;
			height: 21px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: ${ColorStyles.TextBlackAlphaL};
			margin-bottom: 5px;
			font-size: 12px;
			img {
				width: 10px;
				height: 10px;
				opacity: 0.6;
			}
		}
		.img-line {
			width: 100%;
			height: 108px;
			display: flex;
			justify-content: center;
			align-items: center;
			.demo-img {
				height: 90%;
				opacity: 0.6;
			}
		}
	}
`;

export interface ICardListProgressBarProps {
	index: number;
	total: number;
}
export const SCardListProgressBar = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.bar-bg {
		width: 285px;
		height: 12px;
		background: ${ColorStyles.CardBackgroundSolid};
		box-shadow: inset 0 1px 6px 0px rgba(0, 0, 0, 0.6);
		border-radius: 6px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 3px;
		padding-right: 3px;
		.inner-bar {
			position: relative;
			width: ${(props: ICardListProgressBarProps) =>
				(273 * props.index) / props.total + 6 + 'px'};
			height: 6px;
			background: ${ColorStyles.TextBlackAlphaLL};
			box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.2);
			border-radius: 3px;
		}
		.inner-bar:after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background-image: -webkit-gradient(
				linear,
				0 0,
				100% 100%,
				color-stop(0.25, rgba(0, 0, 0, 0.15)),
				color-stop(0.25, transparent),
				color-stop(0.5, transparent),
				color-stop(0.5, rgba(0, 0, 0, 0.15)),
				color-stop(0.75, rgba(0, 0, 0, 0.15)),
				color-stop(0.75, transparent),
				to(transparent)
			);
			z-index: 1;
			background-size: 60px 60px;
			animation: move 3s linear infinite;
			overflow: hidden;
			@keyframes move {
				0% {
					background-position: 0 0;
				}
				100% {
					background-position: 60px 60px;
				}
			}
		}
	}
	.bar-text {
		color: ${ColorStyles.TextBlackAlpha};
	}
`;

export const SCardConversionForm = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	.conv-button {
		outline: none;
		cursor: pointer;
		position: relative;
		width: 50%;
		height: 30px;
		font-family: 'Roboto', 'Microsoft YaHei';
		background-color: transparent;
		color: ${ColorStyles.MainColor};
		transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out,
			background-color 0.2s ease-in-out;
	}
	.conv-button:first-child {
		border-radius: 2px 0 0 2px;
		border-left: 1px solid ${ColorStyles.MainColor};
		border-top: 1px solid ${ColorStyles.MainColor};
		border-bottom: 1px solid ${ColorStyles.MainColor};
		border-right: none;
	}
	.conv-button:last-child {
		border-radius: 0 2px 2px 0;
		border-right: 1px solid ${ColorStyles.MainColor};
		border-top: 1px solid ${ColorStyles.MainColor};
		border-bottom: 1px solid ${ColorStyles.MainColor};
		border-left: none;
	}
	.conv-button:first-child::after {
		content: '';
		width: 1px;
		height: 100%;
		position: absolute;
		right: -1px;
		top: 0px;
		border-right: solid 1px ${ColorStyles.MainColor};
	}
	.conv-button:hover:not(.selected) {
		color: ${ColorStyles.MainColor};
		background-color: ${ColorStyles.MainColorShadow};
	}
	.selected {
		color: ${ColorStyles.TextWhite} !important;
		background-color: ${ColorStyles.MainColor} !important;
	}
`;

export const SCardTransactionForm = styled.div`
	width: 100%;
	margin-top: -10px;
	.token-button {
		outline: none;
		cursor: pointer;
		width: 60px;
		font-family: 'Roboto', 'Microsoft YaHei';
		font-size: 10px;
		background-color: transparent;
		color: ${ColorStyles.TextBlackAlphaLL};
		border: 1px dashed;
		border-color: ${ColorStyles.BorderWhite2};
		transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out,
			background-color 0.2s ease-in-out;
	}
	.token-button:hover {
		color: ${ColorStyles.TextBlackAlphaL};
		border-color: ${ColorStyles.BorderWhite4};
		background-color: ${ColorStyles.ButtonHoverWhite1};
	}
	.trans-button {
		outline: none;
		cursor: pointer;
		width: 115px;
		font-family: 'Roboto', 'Microsoft YaHei';
		background-color: transparent;
		color: ${ColorStyles.TextBlackAlphaLL};
		border: 1px dashed;
		border-color: ${ColorStyles.BorderWhite2};
		transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out,
			background-color 0.2s ease-in-out;
		.superscript {
			margin-left: 2px;
			font-size: 12px;
		}
	}
	.trans-button:hover {
		color: ${ColorStyles.TextBlackAlphaL};
		border-color: ${ColorStyles.BorderWhite4};
		background-color: ${ColorStyles.ButtonHoverWhite1};
	}
	.selected {
		border: 1px solid !important;
		border-color: ${ColorStyles.BorderWhite6} !important;
		color: ${ColorStyles.TextBlackAlpha} !important;
		background-color: ${ColorStyles.ButtonHoverWhite1} !important;
	}
	.wide {
		width: 175px !important;
	}
	.form-button {
		outline: none;
		cursor: pointer;
		width: 120px;
		font-family: 'Roboto', 'Microsoft YaHei';
		background-color: transparent;
		color: ${ColorStyles.TextBlackAlphaL};
		border: 1px solid;
		border-color: ${ColorStyles.BorderWhite4};
		transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out,
			background-color 0.2s ease-in-out;
	}
	.form-button:hover {
		color: ${ColorStyles.TextBlackAlpha};
		border-color: ${ColorStyles.BorderWhite6};
		background-color: ${ColorStyles.ButtonHoverWhite1};
	}
	.form-button:disabled {
		pointer-events: none;
		opacity: 0.2 !important;
	}
	.remark {
		margin-top: 20px;
		font-size: 12px;
		padding: 0 10px;
		text-align: justify;
		color: ${ColorStyles.TextBlackAlphaLL};
	}
`;
export interface ISInputProps {
	width?: string;
	right?: boolean;
	small?: boolean;
}
export const SInput = styled.input`
	outline: none;
	font-size: ${(props: ISInputProps) => (props.small ? '9px' : '14px')};
	background: ${ColorStyles.CardBackgroundSolid};
	box-shadow: none;
	color: ${ColorStyles.TextBlackAlpha};
	border: solid 1px ${ColorStyles.BorderWhite10};
	border-radius: 2px;
	width: ${(props: ISInputProps) => (props.width ? props.width : '160px')};
	height: 36px;
	padding: 0 8px;
	text-align: ${(props: ISInputProps) => (props.right ? 'right' : 'left')};
	transition: box-shadow 0.3s;
	&:focus {
		border-color: ${ColorStyles.MainColor};
		box-shadow: 0 0 4px 1px ${ColorStyles.MainColorShadow};
	}
	&::placeholder {
		color: ${ColorStyles.TextBlackAlphaLLL};
	}
	&.input-error {
		border-color: ${ColorStyles.MainErrorColor} !important;
		box-shadow: 0 0 4px 1px ${ColorStyles.MainErrorColorShadow} !important;
	}
	&:disabled {
		cursor: not-allowed;
	}
`;

export const STableWrapper = styled.div`
	thead > tr > th {
		background: ${ColorStyles.ListHighlight};
		color: ${ColorStyles.TextBlackAlpha};
		border-bottom: 0;
	}
	tbody > tr:nth-child(even) > td {
		background: ${ColorStyles.ListHighlight};
	}
	tbody > tr:nth-child(odd) > td {
		background: transparent;
	}
	tbody > tr:hover > td {
		background: ${ColorStyles.HoverBackgroundSolid};
	}
	td {
		cursor: pointer;
		border-bottom: 0 !important;
		color: ${ColorStyles.TextBlackAlpha};
	}
	tr > .eth,
	tr > .token-ab,
	tr > .fee {
		text-align: right;
	}
	tbody > tr > .fee {
		color: ${ColorStyles.TextRedAlpha};
	}
	.Redeem {
		.eth {
			color: ${ColorStyles.TextGreenAlpha};
		}
		.token-ab {
			color: ${ColorStyles.TextRedAlpha};
		}
	}
	.Create {
		.token-ab {
			color: ${ColorStyles.TextGreenAlpha};
		}
		.eth {
			color: ${ColorStyles.TextRedAlpha};
		}
	}
	.ant-table table {
		border: none;
	}
	.ant-table-placeholder {
		width: 100%;
		background: none !important;
		border: none;
		border-radius: 0;
		color: ${ColorStyles.TextBlackAlphaL};
	}
`;

export const SChartWrapper = styled.div`
	width: 760px;
	height: 350px;
	margin-top: 10px;
	border: 1px dashed;
	border-color: ${ColorStyles.BorderWhite1};
`;

export const SRefreshButton = styled(Button as any)`
	color: ${ColorStyles.TextBlackAlphaLL};
	border: none !important;
	background: transparent !important;
	&:hover {
		color: ${ColorStyles.TextBlackAlpha};
	}
	&:focus {
		color: ${ColorStyles.TextBlackAlphaL};
	}
	&:after {
		border: 0 solid ${ColorStyles.BorderWhite5};
	}
	&:disabled {
		color: ${ColorStyles.TextBlackAlphaLLL};
	}
`;

export const SSlider = styled(Slider as any)`
	width: 100%;
	.ant-slider-track {
		background-color: ${ColorStyles.MainColorAlpha};
	}
	&:hover .ant-slider-track {
		background-color: ${ColorStyles.MainColor};
	}
	.ant-slider-dot-active {
		border-color: ${ColorStyles.MainColor};
	}
	.ant-slider-handle {
		border: solid 2px ${ColorStyles.MainColorAlpha};
	}
	.ant-slider-handle:focus {
		box-shadow: none !important;
	}
	&:hover .ant-slider-handle:not(.ant-tooltip-open) {
		border-color: ${ColorStyles.MainColor};
	}
`;

injectGlobal([
	`
	body {
		.ant-tooltip-placement-top .ant-tooltip-arrow {
				border-top-color: ${ColorStyles.MainColor};
			}
			.ant-tooltip-inner {
				max-width: 400px;
				border-radius: 2px;
				border: solid 1px ${ColorStyles.MainColor};
				font-size: 12px;
				font-family: 'Roboto', 'Microsoft YaHei';
				background: ${ColorStyles.CardBackgroundSolid};
				box-shadow: none;
				color: ${ColorStyles.MainColor};
			}
			.ant-radio-checked .ant-radio-inner {
				border-color: ${ColorStyles.MainColorAlpha};
			}
			.ant-radio-wrapper:hover .ant-radio .ant-radio-inner, .ant-radio:hover .ant-radio-inner, .ant-radio-focused .ant-radio-inner {
				border-color: ${ColorStyles.MainColor};
			}
			.ant-radio-inner {
				border-radius: 2px;
			}
			.ant-radio-inner:before {
				position: absolute;
				background-size: contain;
				width: 12px;
				height: 9px;
				left: 1px;
				top: 3px;
				z-index: 1;
				border-radius: 0;
				display: table;
				border-top: 0;
				border-left: 0;
				content: ' ';
			}
			.ant-radio-inner:after {
				background-color: ${ColorStyles.MainColor};
				width: 16px;
				height: 16px;
				left: -1px;
				top: -1px;
				border-radius: 1px;
			}
			.ant-radio-checked:after {
				border: 1px solid ${ColorStyles.MainColor};
				border-radius: 2px;
			}
			.ant-slider-mark {
				font-size: 10px;
			}
			.ant-radio-wrapper {
				margin-right: 0 !important;
			}
			.ant-spin {
				color: ${ColorStyles.MainColor};
			}
			.ant-spin-dot i {
				background-color: ${ColorStyles.MainColor};
			}
			.ant-notification {
				width: auto;
			}
			.ant-notification-notice-description {
				font-size: 12px;
			}
			.ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
				background: ${ColorStyles.MainColorShadow};
			}
			.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
				padding: 12px 5px;
			}
			.panel-layer {
				position: fixed;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;
				z-index: 1;
			}

			.panel-wrap {
				overflow: visible !important;
				position: fixed;
				top: 0;
				z-index: 2;
				margin-top: 80px;
				height: 528px;
				width: 200px;
				background: #ffffff;
				border: 1px solid #dedede;
				-webkit-box-shadow: -4px 0 11px 0 rgba(0,0,0,0.14);
				box-shadow: -4px 0 11px 0 rgba(0,0,0,0.14);
				border-radius: 8px 0 0 8px;
				-webkit-transition: all .3s;
				-o-transition: all .3s;
				transition: all .3s;
				.ant-card-body {
					position: relative;
					display: block
				}
			}
			.rightFixed {
				position: absolute;
				width: 180px;
				height: 30px;
				right: 25px;
				top: 5px;
				transform-origin: top left;
				-webkit-transform: rotate(90deg);
				-ms-transform: rotate(90deg);
				transform: rotate(90deg);
			}
			.rightFixed:hover {
				background: ${ColorStyles.TextWhite};
				color: ${ColorStyles.MainColor};
				box-shadow: 0 0 4px 1px ${ColorStyles.MainColorShadow};
			}
			.day-Button {
				border: none;
			}
			.ant-tooltip-placement-right .ant-tooltip-arrow, .ant-tooltip-placement-rightTop .ant-tooltip-arrow, .ant-tooltip-placement-rightBottom .ant-tooltip-arrow {
				border-right-color: transparent !important
			}
		}
	`
] as any);
