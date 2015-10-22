import React from 'react'
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from '../dialog/MapImage'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { fetchList, fetchOngoingList, makeNewItem, removeItem } from '../actions/tasks'

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
		dispatch(fetchOngoingList());
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

	createTaskElements(list, logs){
		const { dispatch } = this.props;

		return _.map(list, task => (
			<TaskItem
				key={task.id}
				task={task}
				tasklog={logs[task._id]}
				dispatch={dispatch}
				global={global}
				onTaskModify={this.showModifyDialog.bind(this)}
			/>
			)
		);
	}

	render() {
		var self = this;
		var tasks = this.props.tasks;
		var tasklog = this.props.tasklog;
		var global = this.props.global;
		const { dispatch } = this.props;

		return (
			<div className="task-view">
				<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" onClick={this.showInputDialog.bind(this)}>
					Add New Task
				</button>
				<TaskInputForm
					ref="taskinputform"
					dispatch={this.props.dispatch}
					onTaskSubmit={this.handleTaskSubmit.bind(this)}
					global={this.props.global}
				/>
				<div className="task-list-ongoing">
					현재 진행중인 작업:
					<div className="row">
						<div className="col-md-6">
							{this.createTaskElements(tasks.ongoinglist, tasklog)}
						</div>
					</div>
				</div>
				<div className="task-list">
					작업 목록:
					<div className="row">
						<div className="col-md-6">
							{this.createTaskElements(tasks.list, tasklog)}
						</div>
						<div className="col-md-6">
							{this.createTaskElements(tasks.plist, tasklog)}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default TaskView;
