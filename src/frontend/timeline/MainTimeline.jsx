'use strict'

import React from 'react'
import Timeline from './timeline'
import _ from 'underscore'
import SvgContainer from '../d3/SvgContainer'
import d3 from 'd3';

export default class MainTimeline extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		let elements = _.map(this.props.timetable.list, item=>{
			return {
				begin: (item.tableslotStart) * (30 * 60 * 1000)
				, end: (item.tableslotEnd) * (30 * 60 * 1000)
				, content: item.summary
			}
		})

		console.log({timetable: this.props.timetable});
		console.log(this.props, elements);

		return (
			<div id='main-timeline-container'>
				<SvgContainer _id='main-timeline' width='100%' height='60px' ref='svg'>
					<Timeline svg={d3.select(React.findDOMNode(this.refs.svg))} elements={elements} height={60} />
				</SvgContainer>
			</div>
		)
	}
}