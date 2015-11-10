'use strict'

import React from 'react'
import d3 from 'd3'
import d3tip from 'd3-tip';
import { Chart, XAxis, YAxis } from '../d3/common';
import { ViewBoxMixin } from '../d3/mixins';
import _ from 'underscore';
import classnames from 'classnames'
var TaskStateType = require('../../constants/TaskStateType');


export default class Timeline extends React.Component{
	constructor(props){
		super(props);
		Object.assign(this, ViewBoxMixin);

		this.state = {
			tickInterval: {unit: 'hour', interval: 3}
			, tickInterval2: {unit: 'hour', interval: 1}
			, tickInterval3: {unit: 'minute', interval: 30}
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
		console.log('clickLog', log, log.begin, new Date(log.begin * (30*60*1000)));
		this.setState({
			leftCursor: new Date(log.begin)
		});
	}

	getTip(){
		if(this.tip){
			return this.tip;
		}

		if(this.props.svg){
			this.tip = d3tip(d3)().attr('class', 'd3-tip').html(function(d) { return d.content; });
			this.props.svg.call(this.tip);
			return this.tip;
		}
		else{
			return null;
		}
	}

	renderLogs(){
		let elements = this.state.elements;
		let items = _.map(elements, log=>{
			let begin = new Date(log.begin);
			let end = new Date(log.end);
			let x0 = this.state.xScale(begin);
			let x1 = this.state.xScale(end);
			let width = x1-x0;

			if(x0 < -7){
				width += x0+7;
				x0 = -7;
			}

			if(x1<0){
				x0 = -7;
				width = 7;
			}

			if(x1 > this.state.range[1]){
				width -= (x1-this.state.range[1]);
			}

			if(x0 > this.state.range[1]){
				x0 = this.state.range[1];
				width = 7;
			}

			
			

			return (
				<g>
					<rect className={classnames({'task-log-elem': true, 'focused': log.focused})} x={x0} width={width+1} y='0' height='40' 
						onClick={this.clickLog.bind(this, log)}
						onMouseOver={this.onMouseOver.bind(this, this.getTip(), log)}
						onMouseOut={this.onMouseOut.bind(this, this.getTip(), log)}
					>
					</rect>
					<rect className='task-log-elem-bottom' x={x0} width={width} y='37' height='3' onClick={this.clickLog.bind(this, log)}>
					</rect>
				</g>
			)
		})

		return (
			{items}
		)
	}

	onMouseOver(tip, element, e){
		if(tip)
			tip.show.apply(this, [element, e.target]);
	}

	onMouseOut(tip, element, e){
		if(tip)
			tip.hide.apply(this, [element, e.target]);
	}

	renderNow(){
		let x = this.state.xScale(new Date(Date.now()));
		let width = 4;

		if(x<0)
			x = 0;

		if(x>this.state.range[1]-width/2)
			x = this.state.range[1]-width/2;

		return (
			<rect className='timeline-bar-now' x={x-width/2} width={width} y='-10' height='60'>
			</rect>
		)
	}

	render() {
		var props = this.props;

		var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

		let elements = this.props.elements || [];
		this.state.elements = elements;

		var width = this.props.width;
		var height = this.props.height;		
		var innerWidth, innerHeight;
		innerWidth = width - props.margins.left - props.margins.right;
		innerHeight = height - props.margins.top - props.margins.bottom;

		var yScale = d3.scale.linear()
			.range([innerHeight, 0]);

		//var xValues = [new Date('2014-03-08T12:00:00.000Z'), new Date('2014-03-10T00:00:00.000Z')];
		var xValues = _.map(this.props.elements, log=>new Date(log.time));
		var domainWindow = d3.extent(xValues);
		var domainSize = this.state.domainSize*60*60*1000;
		var leftDomainWindow = [domainWindow[0], domainWindow[1]-domainSize];
		// var leftCursor = this.state.leftCursor || leftDomainWindow[0];
		var leftCursor = this.props.leftCursor || this.state.leftCursor || new Date(Date.now() - 4*60*60*1000);
		props.leftCursor = undefined;
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

		let repTime = moment(domain[0]);

		var trans = `translate(${ props.margins.left },${ props.margins.top })`;
		return (
			<g transform={trans} className={'timeline ' + props.className}>
				<rect className='background' ref='background' width='100%' height='100%' fill='#fff'>
				</rect>
				<text className='rep-time' x="0" y="15" fontSize="10">
					{`${repTime.format('YY/MM/DD HH:mm')}`}
				</text>
				{this.renderLogs()}
				{this.renderNow()}
				<XAxis
					xAxisClassName='rd3-areachart-xaxis'
					xScale={xScale}
					xAxisTickValues={props.xAxisTickValues}
					xAxisTickInterval={this.state.tickInterval}
					xAxisTickInterval2={this.state.tickInterval2}
					xAxisTickInterval3={this.state.tickInterval3}
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
					stroke='#ddd'
					tickStroke='#ddd'
					fontSize={10}
					tickSize={8}
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
	margins: {top: 10, right: 15, bottom: 30, left: 25},
	yAxisTickCount: 4,
	interpolate: false,
	interpolationType: null,
	className: 'rd3-areachart',
	hoverAnimation: true,
	width: 300,
	height: 100,
	xAxisTickCount: 6

};
