import React from 'react';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import If from '../../utility/if'
import TaskProgress from './TaskProgress'
import { setConfig } from '../actions/config'
import TaskItemDetail from './TaskItemDetail'
import { startItem, pauseItem, completeItem, removeItem, postponeItem, getRemainTime } from '../actions/tasks';
import { setTaskProperty } from '../actions/tasks'
import classnames from 'classnames'


class EventItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	setImportant(value, e){
		let { dispatch } = this.props;
		if(this.props.task)
			dispatch(setTaskProperty(this.props.task, {important: value}));

		e.stopPropagation();
	}

	onMouseOver(){
		let { dispatch } = this.props;
		dispatch(setConfig('focusedTableId', this.props.event._id))
	}

	onClick(){
		let { dispatch } = this.props;
		if(this.props.config.selectedTableId == this.props.event._id){
			dispatch(setConfig('selectedTableId', undefined))
		}
		else{
			dispatch(setConfig('selectedTableId', this.props.event._id))	
		}
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

		return (
			<div className='table-item-title'>
				<If test={important}>
					<div className='table-item-header border-right property' onClick={this.setImportant.bind(this, false)}>
						<i className='fa fa-exclamation'></i>
					</div>
				</If>
				<If test={!important}>
					<div className='table-item-header border-right property' onClick={this.setImportant.bind(this, true)}>
						<i className='fa fa-circle-o'></i>
					</div>
				</If>

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
				<div className='content'>
					{event.summary}
				</div>
				<div className='table-item-header border-left float-right task-progress-container'>
					<TaskProgress count={event.estimation * 3}/>
				</div>
			</div>
		);
	}

	render() {
		let selected = this.props.event._id==this.props.config.selectedTableId;
		return (
			<div className={classnames({'table-item': true, selected})} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} onClick={this.onClick.bind(this)}>
				{this.getSimpleView()}
				<If test={this.props.task!=null && selected} >
					<TaskItemDetail task={this.props.task} tasklog={this.props.tasklog} dispatch={this.props.dispatch}
						global={this.props.global}
					/>
				</If>
			</div>
		)
	}
};

export default EventItem;
