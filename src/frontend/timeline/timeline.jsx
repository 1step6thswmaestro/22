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
	    d3.select($el.parentNode).call(this.makeDragBehavior());
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
			d3.event.sourceEvent.stopPropagation();
			domain = _.map(self.state.domain);
			range = _.map(self.state.range);
			leftmost = undefined;
			origin = undefined;
		
		})
		.on('drag', function(d){
			let $el = React.findDOMNode(self.refs.background);
			var cur = d3.mouse($el);

			let scale = d3.time.scale().range(range).domain(domain);

			leftmost = leftmost || scale.invert(0);
			origin = origin || scale.invert(cur[0]);
			let cursor = scale.invert(cur[0]);


			self.setState({leftCursor: new Date(cursor.getTime() + (leftmost.getTime()-origin.getTime()))});

			//self.state.leftCursor = ;
		})
		.on('dragend', function(d){
		})
		;
	} 

	clickLog(log){
		this.setState({
			leftCursor: new Date(log._time.begin)
		});
	}

	renderLogs(){
		let logs = this.state.logs;
		logs = _.filter(this.state.logs, log=>log._time.begin!=undefined)
		let items = _.map(logs, log=>{
			let begin = new Date(log._time.begin);
			let end = new Date(log._time.end);
			let x0 = this.state.xScale(begin);
			let x1 = this.state.xScale(end);
			let width = x1-x0;

			if(x0 < 0){
				width += x0;
				x0 = 0;
			}

			if(x1<7){
				x0 = 0;
				width = 7;
			}

			if(x1 > this.state.range[1]){
				width -= (x1-this.state.range[1]);
			}

			if(x0 > this.state.range[1]-7){
				x0 = this.state.range[1]-7;
				width = 7;
			}

			console.log(log, x0, x1, width, this.state.range);


			return (
				<rect className='task-log-elem' x={x0} width={width} y='20' height='30' onClick={this.clickLog.bind(this, log)}>
				</rect>
			)
		})

		return (
			{items}
		)
	}

	renderNow(){
		let x = this.state.xScale(new Date(Date.now()));
		let width = 4;

		if(x<0)
			x = 0;

		if(x>this.state.range[1]-width/2)
			x = this.state.range[1]-width/2;

		return (
			<rect className='timeline-bar-now' x={x-width/2} width={width} y='10' height='50'>
			</rect>
		)
	}

	render() {
		var props = this.props;

		console.log('this.props.logs : ', this.props.logs);
		if(!this.props.logs || !this.props.logs.length){
			return (<g>
				<rect ref='background' width='100%' height='100%' fill='#fff'>
				</rect>
			</g>)
		}

		var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

		console.log(this.props.logs);


		let logs = [];
		let last;
		for(var i in this.props.logs){
			iterateLogs(this.props.logs[i]);
		}
		if(last){
			last._time.end = Date.now();
			logs.push(last);
			last = undefined;
		}

		function iterateLogs(log){
			last = last || log;
			last._time = last._time || {};

			let type = log.type;
			if(type == TaskLogType.named.start.id){
				last._time.begin = last._time.begin || log.time;
			}
			else if(type == TaskLogType.named.pause.id 
				|| type == TaskLogType.named.pause.id){
				last._time.end = log.time;
				logs.push(last);
				last = undefined;
			}

		}
		this.state.logs = logs;
		console.log(this.state.logs);

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
		// var leftCursor = this.state.leftCursor || leftDomainWindow[0];
		var leftCursor = this.state.leftCursor || new Date(Date.now() - 4*60*60*1000);
		this.state.leftCursor = leftCursor;
		var domain = [new Date(leftCursor), new Date(leftCursor.getTime() + domainSize)];
		var yMaxValues = [10];

		var xScale = this.state.xScale || d3.time.scale()
		this.state.xScale = xScale;
		this.state.range = [0, innerWidth];
		xScale.range(this.state.range);

		this.state.domain = domain;
		xScale.domain(this.state.domain);

		// xScale.domain(xValues);
		yScale.domain([0, d3.sum(yMaxValues)]);

		var stack = d3.layout.stack()
			.x(props.xAccessor)
			.y(props.yAccessor)
			.values((d)=> { return d.values; });

		var trans = `translate(${ props.margins.left },${ props.margins.top })`;
		return (
			<g transform={trans} className={props.className}>
				<rect ref='background' width='100%' height='100%' fill='#fff'>
				</rect>
				<text x="0" y="0" font-size="55">
			    	{`${domain[0]}`}
			  	</text>
			  	{this.renderLogs()}
			  	{this.renderNow()}
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
