import React from 'react';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import If from '../../utility/if'

class EventItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	getSimpleView(){
		var event = this.props.event;
		let duedate = moment(event.end);

		return (
			<div className='task-item'>
				{event.summary}
				<div className='duedate'>
					<i className='fa fa-clock-o'></i> {duedate.format("YY/MM/DD, HH:mm")}
				</div>
			</div>
		);
	}

	render() {
		return this.getSimpleView();
	}
};

export default EventItem;
