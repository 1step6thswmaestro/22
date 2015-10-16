'use strict'

import React from 'react'
import d3 from 'd3'
import { Chart, XAxis, YAxis } from '../d3/common';
import { ViewBoxMixin } from '../d3/mixins';
import _ from 'underscore';
var TaskLogType = require('../../constants/TaskLogType');

export default class Timeline extends React.Component{
	constructor(props){
		super(props);
		Object.assign(this, ViewBoxMixin);

		this.state = {
			tickInterval: {unit: 'hour', interval: 6}
			, domainSize: 24
			, leftOffset: 0
		}
  	}

	componentDidMount(){
		let $el = React.findDOMNode(this.refs.background);
		console.log('dom : ', $el);
	    d3.select($el).call(this.makeDragBehavior());
	}

	makeDragBehavior(){
  		let self = this;
  		
  		let domain, range;

		let leftmost;
		let origin;

		return d3.behavior.drag()
		// .origin(function(){
		// 	//console.log('origin', this, this.getBoundingClientRect());
		// 	return {x:0, y:0}
		// })
		.on('dragstart', function(d){
			console.log('dragstart', d, d3.event);

			d3.event.sourceEvent.stopPropagation();
			domain = _.map(self.state.domain);
			range = _.map(self.state.range);
			leftmost = undefined;
			origin = undefined;
		
		})
		.on('drag', function(d){
			let $el = React.findDOMNode(self.refs.background);
			console.log({$el});
			var cur = d3.mouse($el);

			console.log(self.state, range, domain);
			let scale = d3.time.scale().range(range).domain(domain);

			leftmost = leftmost || scale.invert(0);
			origin = origin || scale.invert(cur[0]);
			let cursor = scale.invert(cur[0]);


			console.log(leftmost, cursor, origin, leftmost + (cursor-origin));

			self.setState({leftCursor: new Date(cursor.getTime() + (leftmost.getTime()-origin.getTime()))});

			//self.state.leftCursor = ;
		})
		.on('dragend', function(d){
		})
		;
	} 

	renderLogs(){
		let items = _.map(this.state.logs, log=>{
			let begin = new Date(log._time.begin);
			let end = new Date(log._time.end);
			console.log(log, begin, end);
			let x0 = this.state.xScale(begin);
			let x1 = this.state.xScale(end);
			let width = x1-x0;
			if(x0<0){
				x0 = 0;
				width = 7;
			}
			if(x0 > this.state.range[1]-7){
				x0 = this.state.range[1]-7;
				width = 7;
			}

			return (
				<rect x={x0} width={width} fill='black' y='10' height='50'>
				</rect>
			)
		})

		return (
			{items}
		)
	}

	render() {
		var props = this.props;
		console.log('props : ', props);

		if(!this.props.logs || !this.props.logs.length){
			console.log('this.props.logs : ', this.props.logs);
			return (<g>
				<rect ref='background' width='100%' height='100%' fill='#fff'>
				</rect>
			</g>)
		}

		var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');


		let logs = [];
		let last;
		console.log(_.range(0, this.props.logs.length-1), this.props.logs);
		for(var i in _.range(0, this.props.logs.length-1)){
			let cur = this.props.logs[i];
			let next = this.props.logs[i+1];

			reduceLogs(cur, next);
		}

		function reduceLogs(cur, next){
			last = last || cur;
			last._time = last._time || {};

			let type = cur.type;
			if(type == TaskLogType.named.create.id 
				|| type == TaskLogType.named.start.id){
				last._time.begin = cur.time;
			}
			else if(type == TaskLogType.named.pause.id 
				|| type == TaskLogType.named.pause.id){
				last._time.end = cur.time;
				logs.push(last);
				last = undefined;
			}
		}
		this.state.logs = logs;



		console.log('getOuterDimensions', this.getOuterDimensions());

		// Calculate inner chart dimensions

		var width = this.props.width;
		var height = this.props.height;		
		var innerWidth, innerHeight;
		innerWidth = width - props.margins.left - props.margins.right;
		innerHeight = height - props.margins.top - props.margins.bottom;

		var yScale = d3.scale.linear()
			.range([innerHeight, 0]);

		//var xValues = [new Date('2014-03-08T12:00:00.000Z'), new Date('2014-03-10T00:00:00.000Z')];
		var xValues = _.map(this.props.logs, log=>new Date(log.time));
		var domainWindow = d3.extent(xValues);
		var domainSize = this.state.domainSize*60*60*1000;
		var leftDomainWindow = [domainWindow[0], domainWindow[1]-domainSize];
		var leftCursor = this.state.leftCursor || leftDomainWindow[0];
		this.state.leftCursor = leftCursor;
		console.log({xValues, domainWindow, domainSize, leftDomainWindow, leftCursor})
		console.log(leftCursor, leftCursor.getTime());
		var domain = [new Date(leftCursor), new Date(leftCursor.getTime() + domainSize)];
		var yMaxValues = [10];

		var xScale = this.state.xScale || d3.time.scale()
		this.state.xScale = xScale;
		this.state.range = [0, innerWidth];
		xScale.range(this.state.range);

		this.state.domain = domain;
		xScale.domain(this.state.domain);

		console.log('domain : ', domain);
		// xScale.domain(xValues);
		yScale.domain([0, d3.sum(yMaxValues)]);

		var stack = d3.layout.stack()
			.x(props.xAccessor)
			.y(props.yAccessor)
			.values((d)=> { return d.values; });

		console.log('props : ', {innerWidth, innerHeight}, props.height);

		var trans = `translate(${ props.margins.left },${ props.margins.top })`;
		return (
			<g transform={trans} className={props.className}>
				<rect ref='background' width='100%' height='100%' fill='#fff'>
				</rect>
				<text x="0" y="0" font-size="55">
			    	{`${domain[0]}, ${domain[1]}`}
			  	</text>
			  	{this.renderLogs()}
				<XAxis
					xAxisClassName='rd3-areachart-xaxis'
					xScale={xScale}
					xAxisTickValues={props.xAxisTickValues}
					xAxisTickInterval={this.state.tickInterval}
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
		);
	}
};

Timeline.propTypes = {
	margins:           React.PropTypes.object,
	interpolate:       React.PropTypes.bool,
	interpolationType: React.PropTypes.string,
	hoverAnimation:    React.PropTypes.bool,
	width:    			React.PropTypes.number,
	height:    			React.PropTypes.number,
};

Timeline.defaultProps = {
	margins: {top: 10, right: 10, bottom: 25, left: 25},
	yAxisTickCount: 4,
	interpolate: false,
	interpolationType: null,
	className: 'rd3-areachart',
	hoverAnimation: true,
	width: 300,
	height: 100,
	xAxisTickCount: 6

};
