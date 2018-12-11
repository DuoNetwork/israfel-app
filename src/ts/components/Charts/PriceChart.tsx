import * as d3 from 'd3';
import moment from 'moment';
import * as React from 'react';
import { ColorStyles } from 'ts/common/styles';
import { IAcceptedPrice } from '../../../../../duo-admin/src/common/types';

const margin = { top: 5, right: 5, bottom: 30, left: 25 };
const width = 222 - margin.left - margin.right;
const height = 110 - margin.top - margin.bottom;

function drawLines(
	el: Element,
	sourceData: IAcceptedPrice[],
	timeStep: number,
	name: string,
	isA: boolean,
	label: string
) {
	if (!sourceData.length) {
		d3.selectAll('.loading').remove();
		d3.select(el)
			.append('div')
			.attr('class', 'loading')
			.html(
				'<span>Loading...</span><img class="loading-img" src="../../../images/abc.gif" />'
			);
		return;
	}
	// //Establish SVG Playground
	d3.selectAll('.loading' + name).remove();
	d3.selectAll('#timeserieschart' + name).remove();
	const maxNumber = d3.max(sourceData.map(d => (isA ? d.navA : d.navB))) || 0;
	const miniNumber = d3.min(sourceData.map(d => (isA ? d.navA : d.navB))) || 0;
	const maxTimestamp = d3.max(sourceData.map(d => d.timestamp)) || 0;
	const miniTimestamp = d3.min(sourceData.map(d => d.timestamp)) || 0;
	const svg = d3
		.select(el)
		.append('svg')
		.attr('id', 'timeserieschart' + name)
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);
	const xScale = d3
		.scaleLinear()
		.domain([miniTimestamp, maxTimestamp])
		.range([0, width]);
	//ETH Linear YScale
	const ethYScale = d3
		.scaleLinear()
		.domain([miniNumber * 0.9, maxNumber * 1.1])
		.range([height, 0]);
	//Axis
	const formatString = (step: number, date: number) => {
		switch (step) {
			case 60000:
				return 'HH:mm';
			case 600000:
				return moment(date).format('HH') === '00' ? 'MM-DD' : 'HH:mm';
			default:
				return moment(date).format('HH') === '00' ? 'MM-DD' : 'HH:mm';
		}
	};
	const zoomFormat = (date: number) => moment(date).format(formatString(timeStep, date));
	const xAxis = d3
		.axisBottom(xScale)
		.ticks(6)
		.tickSize(2)
		.tickFormat(zoomFormat as any);
	// .tickFormat(zoomFormat as any);
	const lyAxis = d3
		.axisLeft(ethYScale)
		.tickSize(3)
		.ticks(5)
		.tickFormat(
			d =>
				d3
					.format(',.2f')(d)
					.toString() || ''
		);
	//Grid
	const yGrid = d3
		.axisLeft(ethYScale)
		.ticks(5)
		.tickSize(-width)
		.tickFormat(() => '');
	const chart = svg
		.append('g')
		.attr('class', 'graph-area' + name)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	const aX = chart
		.append('g')
		.attr('class', 'x-axis' + name)
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis as any);
	aX.selectAll('text')
		.style('text-anchor', 'middle')
		.style('font-size', '8px')
		.style('color', ColorStyles.TextBlackAlphaLL);
	aX.selectAll('.tick')
		.selectAll('line')
		.attr('stroke', ColorStyles.BorderWhite1);
	aX.selectAll('.domain').attr('stroke', ColorStyles.BorderWhite1);
	const aY = chart
		.append('g')
		.attr('class', 'ly-axis' + name)
		.call(lyAxis as any);
	aY.selectAll('text')
		.style('font-size', '8px')
		.style('color', ColorStyles.TextBlackAlphaLL);
	aY.selectAll('.tick')
		.selectAll('line')
		.attr('stroke', ColorStyles.BorderWhite1);
	aY.selectAll('.domain').attr('stroke', ColorStyles.BorderWhite1);
	chart
		.append('defs')
		.append('clipPath')
		.attr('id', 'clip' + name)
		.append('rect')
		.attr('x', 1)
		.attr('y', 0)
		.attr('width', width - 1)
		.attr('height', height);
	const yGridLines = chart
		.append('g')
		.attr('class', 'y-grid' + name)
		.style('stroke-dasharray', '3, 3')
		.call(yGrid as any);
	yGridLines
		.selectAll('.tick')
		.selectAll('line')
		.attr('stroke', ColorStyles.BorderWhite1);
	yGridLines.selectAll('.domain').attr('stroke', ColorStyles.BorderWhite1);
	const text = svg
		.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(50, 20)')
		.attr('class', 'label' + name) //easy to style with CSS
		.text(label);
	text.style('text-anchor', 'middle')
		.style('font-size', '12px')
		.style('color', ColorStyles.TextBlackAlphaLL);
	// chart
	// 	.append('g')
	// 	.attr('class', 'placeHolder' + name)
	// 	.append("text")
	// 	.call("PlaceHolder" as any);
	// Chart Data
	const chartdata = chart
		.append('g')
		.attr('class', 'chart-data' + name)
		.attr('clip-path', `url(#${'clip' + name})`);
	const line = d3
		.line<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y(d => {
			return ethYScale(isA ? d.navA : d.navB);
		});
	const ohlc = chartdata.append('g').attr('class', 'ohlc' + name);
	ohlc.selectAll('g')
		.data(sourceData)
		.enter()
		.append('g');
	const segments = svg.append('g').attr('class', 'segments' + name);
	segments
		.selectAll('g')
		.data(sourceData)
		.enter()
		.append('g');
	const segBar = segments.selectAll('g');
	segBar
		.append('circle')
		.attr('class', 'segdot-eth' + name)
		.attr('cx', (d: any) => xScale(d.timestamp))
		.attr('cy', (d: any) => ethYScale(isA ? d.navA : d.navB))
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('r', 1)
		.style('fill', isA ? ColorStyles.BeethovenTokenAColor : ColorStyles.BeethovenTokenBCollar);
	svg.append('path')
		.datum(sourceData)
		.attr('class', 'line' + name)
		.attr('d', line)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('fill', 'none')
		.attr('stroke', isA ? ColorStyles.BeethovenTokenAColor : ColorStyles.BeethovenTokenBCollar)
		.attr('stroke-width', 2);
}

interface IProps {
	prices: any[];
	timeStep: number;
	name: string;
	isA: boolean;
	label: string;
}

export default class TimeSeriesChart extends React.Component<IProps> {
	private chartRef: any;
	constructor(props: IProps) {
		super(props);
		this.chartRef = React.createRef();
	}

	public componentDidMount() {
		const { prices, timeStep, name, isA, label } = this.props;
		drawLines(this.chartRef.current as Element, prices, timeStep, name, isA, label);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		const { prices, timeStep, name, isA, label } = nextProps;
		if (JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices))
			drawLines(this.chartRef.current as Element, prices, timeStep, name, isA, label);

		return false;
	}

	public render() {
		return (
			<div
				className="chart-wrapper"
				style={{ width: width, height: height }}
				ref={this.chartRef}
			/>
		);
	}
}
