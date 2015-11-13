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
import TaskStateType from '../../../constants/TaskStateType';

class EventItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	setProperty(propertyName, value, e){
		let { dispatch } = this.props;

		if(this.props.task)
			dispatch(setTaskProperty(this.props.task, {[propertyName]: value}));

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
		dispatch(setConfig('focusedTableId', null))
	}

	renderProperty(propertyName, opt){
		let task = this.props.task;
		let propertyValue = task && task[propertyName] == true;
		let setProperty = this.setProperty.bind(this);

		opt = _.defaults(opt||{}, {
			icon: 'fa-exclamation'
			, icon2: 'fa-circle-o'
			, className: ''
		});

		if(propertyValue){
			return (
				<div className={`table-item-header property ${opt.className}`} onClick={setProperty.bind(this, propertyName, false)}>
					<i className={`fa ${opt.icon}`}></i>
				</div>
			)
		}
		else{
			return (
				<div className={`table-item-header property ${opt.className}`} onClick={setProperty.bind(this, propertyName, true)}>
					<i className={`fa ${opt.icon2}`}></i>
				</div>
			)
		}
	}	

	getSimpleView(){
		var event = this.props.event;
		var task = this.props.task;
		let start = moment(new Date(event.tableslotStart * (1000*60*30)));
		let end = moment(new Date(event.tableslotEnd * (1000*60*30)));
		let renderProperty = this.renderProperty.bind(this);

		return (
			<div className='table-item-title' onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} onClick={this.onClick.bind(this)}>
				{renderProperty('important', {className: 'border-right'})}
				{renderProperty('adjustable', {className: 'border-right'})}
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
					<If test={task && task.state == TaskStateType.named.start.id}>
						<i className='fa fa-play mr10'></i>
					</If>
					{event.summary}
				</div>
				<div className='table-item-header border-left float-right task-progress-container'>
					<TaskProgress count={(event.tableslotEnd-event.tableslotStart)/2}/>
				</div>
			</div>
		);
	}

	render() {
		let selected = this.props.event._id==this.props.config.selectedTableId;
		return (
			<div className={classnames({'table-item': true, selected})}>
				{this.getSimpleView()}
				<If test={this.props.task!=null && selected} >
					<TaskItemDetail 
						event={this.props.event}
						task={this.props.task} tasklog={this.props.tasklog} 
						dispatch={this.props.dispatch}
						global={this.props.global}
						setProperty={this.setProperty.bind(this)}
						onTaskModify={this.props.onTaskModify.bind(this, this.props.task)}
					/>
				</If>
			</div>
		)
	}
};

export default EventItem;
