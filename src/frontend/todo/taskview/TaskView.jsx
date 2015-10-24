import React from 'react'
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from '../dialog/MapImage'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { fetchList, fetchOngoingList, makeNewItem, removeItem, changePriorityCriterion } from '../actions/tasks'

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
				tasklog={logs.groupBy[task._id]}
				dispatch={dispatch}
				global={global}
				onTaskModify={this.showModifyDialog.bind(this)}
			/>
			)
		);
	}
	onTimePrefOnlyButtonClick(){
		const { dispatch } = this.props;
		if (this.props.tasks.priority_criterion == 'timepref'){
			dispatch(changePriorityCriterion('all'));
		}
		else{
			dispatch(changePriorityCriterion('timepref'));
		}
	}

	render() {
		var self = this;
		var tasks = this.props.tasks;
		var tasklog = this.props.tasklog;
		var global = this.props.global;
		const { dispatch } = this.props;

		console.log(tasks);
		var priorityTimePrefOnlyActiveFlag = 'btn btn-primary btn-lg';
		if (this.props.tasks.priority_criterion == 'timepref'){
			priorityTimePrefOnlyActiveFlag = 'btn btn-primary btn-lg active';
		}

		return (
			<div className="task-view">
				<div className="task-list">
					<div className="row">
						<div className="col-md-12">
							{this.createTaskElements(tasks.plist, tasklog)}
						</div>
					</div>
				</div>
				<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" onClick={this.showInputDialog.bind(this)}>
					Add New Task
				</button>
				<button type="button" id="priorityTimePrefOnly" className={priorityTimePrefOnlyActiveFlag} onClick={this.onTimePrefOnlyButtonClick.bind(this)}>
					시간 선호도만으로 추천
				</button>
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
