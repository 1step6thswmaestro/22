import React from 'react';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import If from '../../utility/if'
import TaskProgress from './TaskProgress'
import { setTaskProperty } from '../actions/tasks'
import { setConfig } from '../actions/config'

class EventItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	setImportant(value){
		let { dispatch } = this.props;
		alert(value);
		if(this.props.task)
			dispatch(setTaskProperty(this.props.task, {important: value}));
	}

	onMouseOver(){
		let { dispatch } = this.props;
		console.log('focusedTask', this.props.event);
		dispatch(setConfig('focusedTask', this.props.event.taskId))
	}

	onMouseOut(){
		let { dispatch } = this.props;
		dispatch(setConfig('focusedTask', null))
	}

	getSimpleView(){
		var event = this.props.event;
		var task = this.props.task;
		let start = moment(new Date(event.tableslotStart * (1000*60*30)));
		let end = moment(new Date(event.tableslotEnd * (1000*60*30)));
		let important = task && task.important==true;

		console.log({event});

		return (
			<div className='table-item'>
				<div className='table-item-header border-right'>
					<If test={important}>
						<i className='fa fa-exclamation' onClick={this.setImportant.bind(this, false)}></i>
					</If>
					<If test={!important}>
						<i className='fa fa-circle-o' onClick={this.setImportant.bind(this, true)}></i>
					</If>
				</div>
				<div className='table-item-header border-right'>
					<i className='fa fa-check-circle'></i>
				</div>
				<div className='table-item-header'>
					<i className='fa fa-check-circle'></i>
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
