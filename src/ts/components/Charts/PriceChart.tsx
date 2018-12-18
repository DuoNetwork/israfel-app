import * as d3 from 'd3';
// import moment from 'moment';
import * as React from 'react';
import { ColorStyles } from 'ts/common/styles';
import { IAcceptedPrice } from '../../../../../duo-admin/src/common/types';
import util from '../../common/util';

const margin = { top: 0, right: 5, bottom: 0, left: 0 };
const width = 222 - margin.left - margin.right;
const height = 110 - margin.top - margin.bottom;

function drawLines(
	el: Element,
	sourceData: IAcceptedPrice[],
	timeStep: number,
	name: string,
	isA: boolean
) {
	if (!sourceData.length) {
		d3.selectAll('.loading').remove();
		d3.select(el)
			.append('div')
			.attr('class', 'loading')
			.html('<span>Loading...</span>');
		return;
	}
	const now = util.getUTCNowTimestamp();
	const beginningTime = now / 1000 - 24 * timeStep;
	const source = sourceData.filter(a => a.timestamp / 1000 > beginningTime);
	//Establish SVG Playground
	d3.selectAll('.loading' + name).remove();
	d3.selectAll('#timeserieschart' + name).remove();
	const maxNumber = d3.max(source.map(d => (isA ? d.navA : d.navB))) || 0;
	const miniNumber = d3.min(source.map(d => (isA ? d.navA : d.navB))) || 0;
	const maxTimestamp = d3.max(source.map(d => d.timestamp)) || 0;
	const miniTimestamp = d3.min(source.map(d => d.timestamp)) || 0;
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
	const chart = svg
		.append('g')
		.attr('class', 'graph-area' + name)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	chart
		.append('defs')
		.append('clipPath')
		.attr('id', 'clip' + name)
		.append('rect')
		.attr('x', 1)
		.attr('y', 0)
		.attr('width', width - 1)
		.attr('height', height);
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
	const background = d3
		.area<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y0(0)
		.y1(d => {
			return ethYScale(isA ? d.navA : d.navB);
		});
	const area = d3
		.area<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y0(height)
		.y1(d => {
			return ethYScale(isA ? d.navA : d.navB);
		});
	const ohlc = chartdata.append('g').attr('class', 'ohlc' + name);
	ohlc.selectAll('g')
		.data(source)
		.enter()
		.append('g');
	const segments = svg.append('g').attr('class', 'segments' + name);
	segments
		.selectAll('g')
		.data(source)
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
		.datum(source)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('class', 'background')
		.attr('d', background)
		.attr('fill', ColorStyles.TextBlackAlphaLLL);
	svg.append('path')
		.datum(source)
		.attr('class', 'line' + name)
		.attr('d', line)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('fill', 'none')
		.attr('class', 'area')
		.attr('d', area)
		.attr('fill', isA ? ColorStyles.BeethovenTokenAColor : ColorStyles.BeethovenTokenBCollar);
}

interface IProps {
	prices: any[];
	timeStep: number;
	name: string;
	isA: boolean;
}

export default class TimeSeriesChart extends React.Component<IProps> {
	private chartRef: any;
	constructor(props: IProps) {
		super(props);
		this.chartRef = React.createRef();
	}

	public componentDidMount() {
		const { prices, timeStep, name, isA } = this.props;
		drawLines(this.chartRef.current as Element, prices, timeStep, name, isA);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		const { prices, timeStep, name, isA } = nextProps;
		if (
			JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices) ||
			JSON.stringify(nextProps.timeStep) !== JSON.stringify(this.props.timeStep)
		)
			drawLines(this.chartRef.current as Element, prices, timeStep, name, isA);

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
