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
		let tasklog = _.map(this.props.tasklog.list, log=>log);
		console.log('tasklog : ', tasklog);
		return (
			<SvgContainer width='100%' height='120px'>
				<Timeline logs={tasklog}/>
			</SvgContainer>
		)
	}
}