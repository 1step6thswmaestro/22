'use strict'

import React from 'react'
import d3 from 'd3'
import { Chart, XAxis, YAxis } from '../d3/common';
import { ViewBoxMixin } from '../d3/mixins';

export default class Timeline extends React.Component{
	constructor(props){
		super(props);
		Object.assign(this, ViewBoxMixin);

  	}

	render() {
		var props = this.props;
		var xAxisTickInterval = {unit: 'hour', interval: 6}
		console.log('props : ', props);

		var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

		console.log('getOuterDimensions', this.getOuterDimensions());

		// Calculate inner chart dimensions

		var width = this.getOuterDimensions().width;
		var height = this.getOuterDimensions().height;
		var innerWidth, innerHeight;
		innerWidth = this.getOuterDimensions().width - props.margins.left - props.margins.right;
		innerHeight = this.getOuterDimensions().height - props.margins.top - props.margins.bottom;

		var yScale = d3.scale.linear()
			.range([innerHeight, 0]);

		var xValues = [new Date('2014-03-08T12:00:00.000Z'), new Date('2014-03-10T00:00:00.000Z')];
		// var xValues = [10, 20, 30];
		var yValues = [];
		var yMaxValues = [10];

		var xScale;
		console.log(xValues, Object.prototype.toString.call(xValues[0]), xAxisTickInterval);
		if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]' && xAxisTickInterval) {
			xScale = d3.time.scale()
				.range([0, innerWidth]);
		} else {
			xScale = d3.scale.linear()
				.range([0, innerWidth]);
		}

		xScale.domain(d3.extent(xValues));
		// xScale.domain(xValues);
		yScale.domain([0, d3.sum(yMaxValues)]);

		var stack = d3.layout.stack()
			.x(props.xAccessor)
			.y(props.yAccessor)
			.values((d)=> { return d.values; });

		console.log('props : ', {innerWidth, innerHeight}, props.height);

		var trans = `translate(${ props.margins.left },${ props.margins.top })`;
		return (
			<div>
				<svg width={width} height={height}>
					<g transform={trans} className={props.className}>
						<XAxis
							xAxisClassName='rd3-areachart-xaxis'
							xScale={xScale}
							xAxisTickValues={props.xAxisTickValues}
							xAxisTickInterval={xAxisTickInterval}
							xAxisTickCount={props.xAxisTickCount}
							xAxisLabel={props.xAxisLabel}
							xAxisLabelOffset={props.xAxisLabelOffset}
							tickFormatting={props.xAxisFormatter}
							xOrient={props.xOrient}
							yOrient={props.yOrient}
							margins={props.margins}
							width={innerWidth}
							height={innerHeight}
							gridVertical={props.gridVertical}
							gridVerticalStroke={props.gridVerticalStroke}
							gridVerticalStrokeWidth={props.gridVerticalStrokeWidth}
							gridVerticalStrokeDash={props.gridVerticalStrokeDash}
							stroke='black'
						/>
						<YAxis
							yAxisClassName='rd3-areachart-yaxis'
							yScale={yScale}
							yAxisTickValues={props.yAxisTickValues}
							yAxisTickInterval={props.yAxisTickInterval}
							yAxisTickCount={props.yAxisTickCount}
							yAxisLabel={props.yAxisLabel}
							yAxisLabelOffset={props.yAxisLabelOffset}
							tickFormatting={props.yAxisFormatter}
							xOrient={props.xOrient}
							yOrient={props.yOrient}
							margins={props.margins}
							width={innerWidth}
							height={props.height}
							gridHorizontal={props.gridHorizontal}
							gridHorizontalStroke={props.gridHorizontalStroke}
							gridHorizontalStrokeWidth={props.gridHorizontalStrokeWidth}
							gridHorizontalStrokeDash={props.gridHorizontalStrokeDash}
						/>
			  		</g>
				</svg>
		  </div>
		);
	}
};

Timeline.propTypes = {
	margins:           React.PropTypes.object,
	interpolate:       React.PropTypes.bool,
	interpolationType: React.PropTypes.string,
	hoverAnimation:    React.PropTypes.bool,
};

Timeline.defaultProps = {
	margins: {top: 10, right: 20, bottom: 40, left: 45},
	yAxisTickCount: 4,
	interpolate: false,
	interpolationType: null,
	className: 'rd3-areachart',
	hoverAnimation: true
};
