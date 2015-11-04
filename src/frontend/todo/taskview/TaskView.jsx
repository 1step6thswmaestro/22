import React from 'react'
import TaskItem from './TaskItem'
import EventItem from './EventItem'
import TaskInputForm from './TaskInputForm'
import MapImage from '../dialog/MapImage'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { fetchList, fetchPrioritizedList, makeNewItem, removeItem } from '../actions/tasks'
import { fetchList as fetchEventList, fetchTimetable } from '../actions/events'

import _ from 'underscore'

class TaskView extends React.Component{
	// Define every task handling methods here. Subcomponents only use handles defined in here.
	// We have to avoid distributed handle definition to reduce complexity.
	constructor(){
		super();
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchList());
		//dispatch(fetchEventList());
		dispatch(fetchTimetable());
		dispatch(fetchPrioritizedList());
	}

	handleTaskSubmit(task) {
		const { dispatch } = this.props;
		dispatch(makeNewItem(task));
	}

	showInputDialog(){
		this.refs.taskinputform.setState({
			modifyMode: false
		});
		this.refs.taskinputform.setDate(this.props.global.time);

		var modal = $(React.findDOMNode(this.refs.taskinputform));
		modal.modal({
			backdrop: true
			, keyboard: true
			, show: true
		});
	}

	showModifyDialog(task) {
		this.refs.taskinputform.onModifyRequest(task);
		var modal = $(React.findDOMNode(this.refs.taskinputform));
		modal.modal({
			backdrop: true
			, keyboard: true
			, show: true
		});
	}

	render() {
		var self = this;
		var tasks = this.props.tasks;
		var tasklog = this.props.tasklog;

		var events = this.props.events;
		const { global, config, dispatch } = this.props;

		console.log({events});

	    function createTaskElements(list){
			return _.map(list, task => (
		        <TaskItem key={task._id} task={task} tasklog={tasklog[task._id]} dispatch={dispatch} global={global} onTaskModify={self.showModifyDialog.bind(self, task)} />)
			);
	    }

	    function createEventElements(list){
			return _.map(list, item => (
		        <EventItem key={item._id} event={item} dispatch={dispatch} global={global} />)
			);
	    }

		return (
			<div className="task-view-wrapper">
				<div className="task-view">
					<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" onClick={this.showInputDialog.bind(this)}>
						Add New Task
					</button>
					<div className="task-list-wrapper">
						<div className="task-list">
							<div className="row">
								<div className="col-sm-6 no-padding-right">
									{createTaskElements(
										config.displayActiveListOnly?
											tasks.activeList
											:tasks.plist)}
								</div>
								<div className="col-sm-6 no-padding-left">
									{createEventElements(events.list)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<TaskInputForm
					ref="taskinputform"
					dispatch={this.props.dispatch}
					onTaskSubmit={this.handleTaskSubmit.bind(this)}
					global={this.props.global}
				/>
			</div>
		);
	}
};

export default TaskView;
