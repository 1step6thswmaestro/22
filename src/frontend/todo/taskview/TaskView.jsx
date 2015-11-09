import React from 'react'
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from '../dialog/MapImage'
import If from '../../utility/if'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { fetchList, fetchPrioritizedList, makeNewItem, removeItem } from '../actions/tasks'
import { fetchTimetable } from '../actions/timetable'
import TimeTable from './TimeTable'

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

	addSleepTask(){
		let time = new Date(this.props.global.time || Date.now());
		let hour = time.getHours();
		if(hour > 14){
			time = new Date(time.getTime() + 24 * 60 * 60 * 1000);
		}
		time.setHours(14);
		time.setMinutes(0);

		let created = this.props.global.time || Date.now();
		let duedate = time;

		let data = {name: 'sleep', description: 'sleep', duedate, created, estimation: 8, adjustable: true};
		const { dispatch } = this.props;
		dispatch(makeNewItem(data));
	}

	render() {
		var self = this;
		var tasklog = this.props.tasklog;
		const { global, config, dispatch, tasks, timetable } = this.props;

	    function createTaskElements(list){
			return _.map(list, task => (
		        <TaskItem key={task._id} task={task} tasklog={tasklog[task._id]} dispatch={dispatch} global={global} onTaskModify={self.showModifyDialog.bind(self, task)} />)
			);
	    }

		return (
			<div className="task-view-wrapper">
				<div className="task-view">
					<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" onClick={this.showInputDialog.bind(this)}>
						Add New Task
					</button>
					<button type="button" id="taskAddBtn" className="btn btn-primary btn-lg" onClick={this.addSleepTask.bind(this)}>
						Add Sleep Task
					</button>
					<div className="task-list-wrapper">
						<div className="task-list">
							<div className="row">
								<div className="col-sm-12">
									<If test={this.props.config.showEvent!=false}>
										<TimeTable 
											global={global} 
											config={config} 
											tasks={tasks} 
											timetable={timetable} 
											dispatch={dispatch}
											tasklog={tasklog}
											onTaskModify={self.showModifyDialog.bind(self)}
										/>
									</If>
									<If test={this.props.config.showEvent==false}>
										<div>
											{createTaskElements(tasks.plist)}
										</div>
									</If>
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
