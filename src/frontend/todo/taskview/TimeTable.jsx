import React from 'react'
import EventItem from './EventItem'
import _ from 'underscore'
import moment from 'moment'
import DaySeperator from './DaySeperator'

export default class TimeTable extends React.Component{
	constructor(props){
		super(props)
	}

    renderEvents(){
		const { global, config, dispatch } = this.props;
    	var timetable = this.props.timetable;
		var tasks = this.props.tasks;
		var tasklog = this.props.tasklog;
		var contents = [];

		let latestDay = undefined;

		_.each(timetable.list, item => {

			let time = new Date(item.tableslotStart * (30 * 60 * 1000));
			let day = time.getDay();
			if(day != latestDay){
				contents.push(<DaySeperator time={time} />)
			}
			
			latestDay = day;
			contents.push((
				<EventItem key={item._id} event={item} task={tasks.tasks[item.taskId]} dispatch={dispatch} global={global} 
					config={config}
					tasklog={tasklog.groupBy[item.taskId]}
				/>
			));
		});

		return contents;
    }

	render(){
		return (
			<div>
				{this.renderEvents()}
			</div>
		)
	}
}