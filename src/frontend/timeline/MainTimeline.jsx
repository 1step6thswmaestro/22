'use strict'

import React from 'react'
import Timeline from './timeline'
import _ from 'underscore'
import SvgContainer from '../d3/SvgContainer'

export default class MainTimeline extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		let tasklog = _.map(this.props.tasklog.plist, log=>log);
		return (
			<SvgContainer _id='main-timeline' width='100%' height='60px'>
				<Timeline logs={tasklog} height={60} />
			</SvgContainer>
		)
	}
}