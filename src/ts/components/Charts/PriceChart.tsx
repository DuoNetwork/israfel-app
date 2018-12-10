import * as d3 from 'd3';
import moment from 'moment';
import * as React from 'react';
// import { ColorStyles } from 'ts/common/styles';
import { IAcceptedPrice } from '../../../../../duo-admin/src/common/types';

const margin = { top: 5, right: 5, bottom: 5, left: 5 };
const width = 375 - margin.left - margin.right;
const height = 110 - margin.top - margin.bottom;

function drawLines(el: Element, sourceData: IAcceptedPrice[], timeStep: number) {
	if (!sourceData.length) {
		console.log(timeStep);
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
	// console.log("1234567890");
	console.log("el");
	console.log(el);
	// console.log(sourceData);
	d3.selectAll('.loading').remove();
	d3.selectAll('#timeserieschart').remove();
	const maxNumber = d3.max(sourceData.map(d => d.navA)) || 0;
	const miniNumber = d3.min(sourceData.map(d => d.navA)) || 0;
	const maxTimestamp = d3.max(sourceData.map(d => d.timestamp)) || 0;
	const miniTimestamp = d3.min(sourceData.map(d => d.timestamp)) || 0;
	const svg = d3
		.select(el)
		.append('svg')
		.attr('id', 'timeserieschart')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);
	const xScale = d3
		.scaleLinear()
		.domain([miniTimestamp, maxTimestamp])
		.range([0, width]);
	//ETH Linear YScale
	const ethYScale = d3
		.scaleLinear()
		.domain([miniNumber * 0.9999995, maxNumber * 1.00000005])
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
		.tickFormat(zoomFormat as any);
	// .tickFormat(zoomFormat as any);
	const lyAxis = d3
		.axisLeft(ethYScale)
		.ticks(6)
		.tickFormat(d =>
			d > 1
				? d3
						.format(',.5s')(d)
						.toString() || ''
				: d3
						.format(',.5f')(d)
						.toString() || ''
		);
	//Grid
	const yGrid = d3
		.axisLeft(ethYScale)
		.ticks(10)
		.tickSize(-width)
		.tickFormat(() => '');
	const chart = d3
		.select(el)
		.select('#timeserieschart')
		.append('g')
		.attr('class', 'graph-area')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	const aX = chart
		.append('g')
		.attr('class', 'x-axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis as any);
	aX.selectAll('text').style('text-anchor', 'middle');
	chart
		.append('g')
		.attr('class', 'ly-axis')
		.call(lyAxis as any);
	chart
		.append('defs')
		.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('x', 1)
		.attr('y', 0)
		.attr('width', width - 1)
		.attr('height', height);
	chart
		.append('g')
		.attr('class', 'y-grid')
		.style('stroke-dasharray', '3, 3')
		.call(yGrid as any);
	// Chart Data
	const chartdata = chart
		.append('g')
		.attr('class', 'chart-data')
		.attr('clip-path', 'url(#clip)');
	const line = d3
		.line<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y(d => {
			return ethYScale(d.navA);
		});
	const ohlc = chartdata.append('g').attr('class', 'ohlc');
	ohlc.selectAll('g')
		.data(sourceData)
		.enter()
		.append('g');
	const segments = svg.append('g').attr('class', 'segments');
	segments
		.selectAll('g')
		.data(sourceData)
		.enter()
		.append('g');
	const segBar = segments.selectAll('g');
	segBar
		.append('circle')
		.attr('class', 'segdot-eth')
		.attr('cx', (d: any) => xScale(d.timestamp))
		.attr('cy', (d: any) => ethYScale(d.navA))
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('r', 2)
		.style('fill', 'black');
	svg.append('path')
		.datum(sourceData)
		.attr('class', 'line')
		.attr('d', line)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('fill', 'none')
		.attr('stroke', 'red')
		.attr('stroke-width', 1);
}

interface IProps {
	prices: any[];
	timeStep: number;
}

export default class TimeSeriesChart extends React.Component<IProps> {
	private chartRef: any;
	constructor(props: IProps) {
		super(props);
		this.chartRef = React.createRef();
	}

	public componentDidMount() {
		const { prices, timeStep } = this.props;
		console.log("price");
		console.log(prices);
		drawLines(this.chartRef.current as Element, prices, timeStep);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		const { prices, timeStep } = nextProps;
		if (JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices))
			drawLines(this.chartRef.current as Element, prices, timeStep);

		return false;
	}

	public render() {
		return <div className="chart-wrapper" style={{ width: width, height: height}} ref={this.chartRef} />;
	}
}
