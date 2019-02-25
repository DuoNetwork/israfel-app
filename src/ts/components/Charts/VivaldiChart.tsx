import { IPrice } from '@finbook/duo-market-data';
import { Util as CommonUtil } from '@finbook/israfel-common';
import * as d3 from 'd3';
import * as React from 'react';
//import { ColorStyles } from 'ts/common/styles';

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const height = 240 - margin.top - margin.bottom;

function drawLines(
	el: Element,
	sourceData: IPrice[],
	innerWidth: number,
	resetTime: number,
) {
	const width = innerWidth - margin.left - margin.right;
	if (!sourceData.length) {
		d3.selectAll('.loading').remove();
		d3.select(el)
			.append('div')
			.attr('class', 'loading')
			.html('<span>Loading...</span>');
		return;
	}
	const now = CommonUtil.getUTCNowTimestamp();
	const beginningTime = resetTime - 3 * 3600 * 1000;
	const source = sourceData;
	console.log('################## Source')
	console.log(source)
	//Establish SVG Playground
	d3.selectAll('.loading').remove();
	d3.selectAll('#timeserieschart').remove();
	const maxNumber = d3.max(source.map(d => d.close)) || 0;
	const minNumber = d3.min(source.map(d => d.close)) || 0;
	console.log(maxNumber);
	console.log(minNumber);
	const svg = d3
		.select(el)
		.append('svg')
		.attr('id', 'timeserieschart')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);
	const xScale = d3
		.scaleLinear()
		.domain([beginningTime, now])
		.range([0, width]);
	//ETH Linear YScale
	const ethYScale = d3
		.scaleLinear()
		.domain([minNumber * 0.9, maxNumber * 1.1])
		.range([height, 0]);
	const chart = svg
		.append('g')
		.attr('class', 'graph-area')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	const startValue = source[0].close;
	const area = d3
		.area<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y0(ethYScale(startValue))
		.y1(d => {
			return ethYScale(d.close);
		});
	const line = d3
		.line<any>()
		.x(d => {
			return xScale(d.timestamp);
		})
		.y(d => {
			return ethYScale(d.close);
		});
	chart.append('path')
		.datum(source)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('fill', 'none')
		.attr('class', 'area')
		.attr('d', area)
		.attr('fill', 'rgb(100,100,100)');
	chart.append('path')
		.datum(source)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('class', 'line')
		.attr('d', line)
		.attr('fill', 'none')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-linecap', 'round')
		.attr('stroke', 'rgb(0,0,0)')
		.attr('stroke-width', 1.5);
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
		const { prices, innerWidth, resetTime } = this.props;
		drawLines(this.chartRef.current as Element, prices, innerWidth, resetTime);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		const { prices, innerWidth, resetTime } = nextProps;
		if (
			JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices) ||
			JSON.stringify(nextProps.innerWidth) !== JSON.stringify(this.props.innerWidth)
		)
			drawLines(this.chartRef.current as Element, prices, innerWidth, resetTime);

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
