import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux';

import TaskView from './taskview/TaskView'
import UserView from './userview/UserView'

import _ from 'underscore'

import DateTimePicker from './dialog/DateTimePicker'

import { setGlobalTime } from './actions/global'

class TodoApp extends React.Component{
	constructor(){
		super();
		this.state = {
			location: '',
			currentView: 'task' // Save current user's view
		};
	}

	componentDidMount() {
	}

	toggleView(){
		var nextView;
		if(this.state.currentView == 'task'){
			nextView = 'user';
		}
		else{
			nextView = 'task';
		}

		this.setState({
			currentView: nextView
		});
	}

	setGlobalTime(time){
		const { dispatch } = this.props;
		dispatch(setGlobalTime(time.valueOf()));
		console.error('global', this.props);
	}

	render() {
		var viewContent;

		if(this.state.currentView == 'task'){
			viewContent = (
				<TaskView dispatch={this.props.dispatch} tasks={this.props.tasks} tasklog={this.props.tasklog} global={this.props.global}/>

			);
		}
		else if(this.state.currentView == 'user'){
			viewContent = (
				<UserView dispatch={this.props.dispatch}  location={this.state.location} global={this.props.global}/>
			);
		}

		return (
			<div className="task-container">
				<header>
					<h1>Give Me Task</h1>
					<div className="view-toggle" onClick={this.toggleView.bind(this)}>
						Click HERE to Toggle UserView/TaskView
					</div>
				</header>
				<DateTimePicker type='inline' onChange={this.setGlobalTime.bind(this)}/>
				{this.props.global.time}
				{viewContent}
			</div>
		);
	}
};

function mapStateToProps(state){
	var props = Object.assign({}, state);
	props.list = _.filter(state.tasks.list, item => !item.removed);
	return props;
};

export default connect(
	mapStateToProps
)(TodoApp);
