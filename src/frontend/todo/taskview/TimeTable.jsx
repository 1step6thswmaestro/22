import React from 'react'
import EventItem from './EventItem'
import _ from 'underscore'

export default class TimeTable extends React.Component{
	constructor(props){
		super(props)
	}

    renderEvents(){
		const { global, config, dispatch } = this.props;
    	var timetable = this.props.timetable;
		var tasks = this.props.tasks;

		return _.map(timetable.list, item => (
	        <EventItem key={item._id} event={item} task={tasks.tasks[item.taskId]} dispatch={dispatch} global={global} config={config}/>)
		);
    }

	render(){
		return (
			<div>
				{this.renderEvents()}
			</div>
		)
	}
}