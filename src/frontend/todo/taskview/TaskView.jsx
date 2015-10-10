import React from 'react'
import TaskForm from './TaskForm';
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from '../utils/MapImage'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { fetchList, makeNewItem, removeItem, updateItem } from '../actions/tasks'

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

	discardTask(taskID){
		const { dispatch } = this.props;
		dispatch(removeItem(taskID));
	}

	updateTask(taskID, patch){
		const { dispatch } = this.props;
		dispatch(updateItem(taskID, patch));
		if(patch.timestampComplete){
			// When this function handles task completion.
			patch['locationstampComplete'] = this.props.location;
		}
		else{
			patch['locationstampComplete'] = null;
		}
	}

	handleTaskSubmit(taskPart) {
		var taskWhole = taskPart;
		// Put current location info into appropriate field.
		taskWhole['locationstampCreated'] = this.props.location; // When this function handles task creation.
		const { dispatch } = this.props;
		dispatch(makeNewItem(taskWhole));
	}

	render() {
		var tasks = this.props.tasks;
		var taskItems = _.map(tasks, function (task) {
			return (
				<TaskItem
					key={task._id}
					task={task}
					onDiscard={this.discardTask.bind(this)}
					onUpdate={this.updateTask.bind(this)}
				/>
			)


		}, this);

		return (
			<div className="task-view">
				<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#taskInputForm">
					Add New Task
				</button>
				<TaskInputForm
					onTaskSubmit={this.handleTaskSubmit.bind(this)}
				/>
				<div className="task-list">
					{taskItems}
				</div>
			</div>
		);
	}
};

export default TaskView;
