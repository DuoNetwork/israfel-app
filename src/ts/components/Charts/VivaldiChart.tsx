import { IPrice } from '@finbook/duo-market-data';
import { Util as CommonUtil } from '@finbook/israfel-common';
import * as d3 from 'd3';
// import moment from 'moment';
import * as React from 'react';
import { ColorStyles } from 'ts/common/styles';

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const height = 240 - margin.top - margin.bottom;

function drawLines(el: Element, sourceData: IPrice[], lastPrice: number, innerWidth: number, resetTime: number) {
	const width = innerWidth - margin.left - margin.right;
	if (!sourceData.length) {
		d3.selectAll('.loading').remove();
		d3.select(el)
			.append('div')
			.attr('class', 'loading');
		return;
	}
	//const now = CommonUtil.getUTCNowTimestamp();
	const beginningTime = resetTime - 12 * 3600 * 1000;
	const endTime = resetTime + 12 * 3600 * 1000;
	const source = [];
	sourceData.forEach(d => source.push(d));
	source.push({
		timestamp: CommonUtil.getUTCNowTimestamp(),
		close: lastPrice
	} as any)
	source.sort((a, b) => a.timestamp - b.timestamp);
	console.log(source)
	//Establish SVG Playground
	d3.selectAll('.loading').remove();
	d3.selectAll('#timeserieschart').remove();
	//const miniTimestamp = d3.min(source.map(d => d.timestamp)) || 0;
	const maxNumber = d3.max(source.map(d => d.close)) || 0;
	const minNumber = d3.min(source.map(d => d.close)) || 0;
	const range = maxNumber - minNumber;
	const svg = d3
		.select(el)
		.append('svg')
		.attr('id', 'timeserieschart')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);
	const xScale = d3
		.scaleLinear()
		.domain([beginningTime, endTime])
		.range([0, width]);
	//ETH Linear YScale
	const ethYScale = d3
		.scaleLinear()
		.domain([minNumber - range * 0.1 , maxNumber + range * 0.1])
		.range([height, 0]);
	const chart = svg
		.append('g')
		.attr('class', 'graph-area')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	// const startValue = source[0].close;
	// const area = d3
	// 	.area<any>()
	// 	.x(d => {
	// 		return xScale(d.timestamp);
	// 	})
	// 	.y0(ethYScale(startValue))
	// 	.y1(d => {
	// 		return ethYScale(d.close);
	// 	});
	const line = d3
		.line<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y(d => {
			return ethYScale(d.close);
		});
	const lineN = d3
		.line<any>()
		.x(d => {
			return d.x;
		})
		.y(d => {
			return d.y;
		});
	// chart.append('path')
	// 	.datum(source)
	// 	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	// 	.attr('fill', 'none')
	// 	.attr('class', 'area')
	// 	.attr('d', area)
	// 	.attr('fill', 'rgb(100,100,100)');
	chart
		.append('path')
		.datum(source)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('class', 'line')
		.attr('d', line)
		.attr('fill', 'none')
		.attr('stroke', ColorStyles.TitlePM)
		.attr('stroke-width', 3);
	chart
		.append('path')
		.attr('class', 'reset-line')
		.attr('d', () => {
			return lineN([
				{ x: xScale(resetTime), y: margin.top },
				{
					x: xScale(resetTime),
					y: height - margin.bottom
				}
			]);
		})
		.attr('stroke', ColorStyles.BorderBlack1)
		.attr('stroke-width', 2);
	// svg.append('rect')
	// 	.attr('x', -1)
	// 	.attr('y', 0)
	// 	.attr('width', width + 2)
	// 	.attr('height', ethYScale(startValue))
	// 	.style('fill', 'rgb(97, 206, 94)')
	// 	.style('mix-blend-mode', 'screen');
	// svg.append('rect')
	// 	.attr('x', -1)
	// 	.attr('y', ethYScale(startValue))
	// 	.attr('width', width + 2)
	// 	.attr('height', height - ethYScale(startValue))
	// 	.style('fill', 'rgb(245, 83, 83)')
	// 	.style('mix-blend-mode', 'screen');
}

interface IProps {
	prices: any[];
	ethPrice: number;
	innerWidth: number;
	resetTime: number;
}

export default class TimeSeriesChart extends React.Component<IProps> {
	private chartRef: any;
	constructor(props: IProps) {
		super(props);
		this.chartRef = React.createRef();
	}

	public componentDidMount() {
		const { prices, ethPrice, innerWidth, resetTime } = this.props;
		drawLines(this.chartRef.current as Element, prices, ethPrice, innerWidth, resetTime);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		const { prices, ethPrice, innerWidth, resetTime } = nextProps;
		if (
			JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices) ||
			JSON.stringify(nextProps.innerWidth) !== JSON.stringify(this.props.innerWidth) ||
			JSON.stringify(nextProps.resetTime) !== JSON.stringify(this.props.resetTime) ||
			JSON.stringify(nextProps.ethPrice) !== JSON.stringify(this.props.ethPrice)
		)
			drawLines(this.chartRef.current as Element, prices, ethPrice, innerWidth, resetTime);

		return false;
	}

	public render() {
		return (
			<div
				className="chart-wrapper"
				style={{ width: this.props.innerWidth, height: height }}
				ref={this.chartRef}
			/>
		);
	}
}
