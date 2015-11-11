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
		let { focusedTableId, selectedTableId } = this.props.config;
		let selectedTableItem;
		let elements = _.map(this.props.timetable.list, item=>{

			if(selectedTableId!=null && item._id == selectedTableId){
				selectedTableItem = item;
			}

			return {
				begin: (item.tableslotStart) * (30 * 60 * 1000)
				, end: (item.tableslotEnd) * (30 * 60 * 1000)
				, content: item.summary
				, focused: focusedTableId!=null && item._id == focusedTableId
			}
		})

		let leftCursor;
		if(selectedTableItem!=null){
			leftCursor = new Date((selectedTableItem.tableslotStart) * (30 * 60 * 1000));
		}

		return (
			<div id='main-timeline-container'>
				<SvgContainer _id='main-timeline' ref='svg'>
					<Timeline 
						svg={d3.select(React.findDOMNode(this.refs.svg))} 
						elements={elements} 
						height={60} 
						leftCursor={leftCursor}
					/>
				</SvgContainer>
			</div>
		)
	}
}