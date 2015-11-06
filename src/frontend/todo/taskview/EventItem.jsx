import React from 'react';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import If from '../../utility/if'
import TaskProgress from './TaskProgress'

class EventItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	getSimpleView(){
		var event = this.props.event;
		let start = moment(new Date(event.tableslotStart * (1000*60*30)));
		let end = moment(new Date(event.tableslotEnd * (1000*60*30)));

		console.log({event});

		return (
			<div className='table-item'>
				<div className='table-item-header'>
				</div>
				<div className='table-item-header date'>
					{start.format("HH:mm")}
				</div>
				<div className='table-item-header date date2 mr10'>
					{end.format("HH:mm")}
				</div>
				{event.summary}
				<TaskProgress count={event.estimation}/>
			</div>
		);
	}

	render() {
		return this.getSimpleView();
	}
};

export default EventItem;
