import React from 'react'
import TaskForm from './TaskForm';
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from '../dialog/MapImage'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { fetchList, makeNewItem, removeItem } from '../actions/tasks'

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
	}

	handleTaskSubmit(task) {
		const { dispatch } = this.props;
		dispatch(makeNewItem(task));
	}

	showDialog(){
		console.log(this.refs.taskinputform);
		this.refs.taskinputform.setDate(this.props.global.time);
		$(React.findDOMNode(this.refs.taskinputform)).modal({
			backdrop: true
			, keyboard: true
			, show: true
		})
	}

	render() {
		var self = this;
		var tasks = this.props.tasks;
		var tasklog = this.props.tasklog;
		var global = this.props.global;
		const { dispatch } = this.props;

	    function createTaskElements(list, logs){
			return _.map(list, task => (
		        <TaskItem key={task.id} task={task} tasklog={tasklog[task._id]} dispatch={dispatch} global={global} />));
	    }

		return (
			<div className="task-view">
				<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" onClick={this.showDialog.bind(this)}>
					Add New Task
				</button>
				<TaskInputForm
					ref='taskinputform'
					onTaskSubmit={this.handleTaskSubmit.bind(this)}
					global={this.props.global}
				/>
				<div className="task-list">
					<div className="row">
						<div className="col-md-6">
							{createTaskElements(tasks.list, tasklog)}
						</div>
						<div className="col-md-6">
							{createTaskElements(tasks.plist, tasklog)}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default TaskView;
