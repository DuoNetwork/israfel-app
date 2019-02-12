import { IAcceptedPrice } from '@finbook/duo-market-data';
import { Util as CommonUtil } from '@finbook/israfel-common';
import * as d3 from 'd3';
import * as React from 'react';
//import { ColorStyles } from 'ts/common/styles';

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = 190 - margin.left - margin.right;
const height = 70 - margin.top - margin.bottom;

function drawLines(
	el: Element,
	sourceData: IAcceptedPrice[],
	timeOffset: number,
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
	const now = CommonUtil.getUTCNowTimestamp();
	const beginningTime = now / 1000 - 24 * timeOffset;
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
	const defs = chart
		.append('defs')
	defs.append('clipPath')
		.attr('id', 'clip' + name)
		.append('rect')
		.attr('x', 1)
		.attr('y', 0)
		.attr('width', width - 1)
		.attr('height', height);
	const grad = defs.append('linearGradient')
		.attr('id', 'gradfill')
		.attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '0%')
		.attr('y2', '100%');
	grad.append('stop')
		.attr('offset', '0%')
		.style('stop-color', 'rgb(128,198,255)')
		.style('stop-opacity', '1');
	grad.append('stop')
		.attr('offset', '100%')
		.style('stop-color', 'rgb(245,247,248)')
		.style('stop-opacity', '1');
	const chartdata = chart
		.append('g')
		.attr('class', 'chart-data' + name)
		.attr('clip-path', `url(#${'clip' + name})`);
	const startValue = isA ? source[0].navA : source[0].navB;
	const area = d3
		.area<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y0(ethYScale(startValue))
		.y1(d => {
			return ethYScale(isA ? d.navA : d.navB);
		});
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
		.data(source)
		.enter()
		.append('g');
	svg.append('path')
		.datum(source)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('fill', 'none')
		.attr('class', 'area')
		.attr('d', area)
		.attr('fill', 'rgb(100,100,100)');
	svg.append('path')
		.datum(source)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('class', 'line')
		.attr('d', line)
		.attr('fill', 'none')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-linecap', 'round')
		.attr('stroke', 'rgb(0,0,0)')
		.attr('stroke-width', 1.5);
	svg.append('rect')
		.attr('x', -1)
		.attr('y', 0)
		.attr('width', width + 2)
		.attr('height', ethYScale(startValue))
		.style('fill', 'rgb(97, 206, 94)')
		.style('mix-blend-mode', 'screen');
	svg.append('rect')
		.attr('x', -1)
		.attr('y', ethYScale(startValue))
		.attr('width', width + 2)
		.attr('height', height - ethYScale(startValue))
		.style('fill', 'rgb(245, 83, 83)')
		.style('mix-blend-mode', 'screen');
}

interface IProps {
	prices: any[];
	timeOffset: number;
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
		const { prices, timeOffset, name, isA } = this.props;
		drawLines(this.chartRef.current as Element, prices, timeOffset, name, isA);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		const { prices, timeOffset, name, isA } = nextProps;
		if (
			JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices) ||
			JSON.stringify(nextProps.timeOffset) !== JSON.stringify(this.props.timeOffset)
		)
			drawLines(this.chartRef.current as Element, prices, timeOffset, name, isA);

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
