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

	handleTaskSubmit(task) {
		var taskWhole = taskPart;
		const { dispatch } = this.props;
		dispatch(makeNewItem(task));
	}

	render() {
		var self = this;
		var tasks = this.props.tasks;

	    function createTaskElements(list){
			return _.map(list, task => (
		        <TaskItem key={task.id} task={task} />));
	    }

		return (
			<div className="task-view">
				<div className="task-box">
					<div className="row">
						<div className="col-md-4">
							<TaskInputForm
								onTaskSubmit={this.handleTaskSubmit.bind(this)}
							/>
						</div>
					</div>
				</div>
				<div className="task-list">
					{createTaskElements(tasks.list)}
					{createTaskElements(tasks.plist)}
				</div>
			</div>
		);
	}
};

export default TaskView;
