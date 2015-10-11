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

	render() {
		var self = this;
		var tasks = this.props.tasks;
		var tasklog = this.props.tasklog;
		const { dispatch } = this.props;

	    function createTaskElements(list, logs){
			return _.map(list, task => (
		        <TaskItem key={task.id} task={task} tasklog={tasklog[task._id]} dispatch={dispatch} />));
	    }

		return (
			<div className="task-view">
				<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#taskInputForm">
					Add New Task
				</button>
				<TaskInputForm
					onTaskSubmit={this.handleTaskSubmit.bind(this)}
				/>
				<div className="task-list">
					{createTaskElements(tasks.list, tasklog)}
					{createTaskElements(tasks.plist, tasklog)}
				</div>
			</div>
		);
	}
};

export default TaskView;
