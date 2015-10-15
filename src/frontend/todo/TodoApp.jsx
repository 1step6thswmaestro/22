import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux';

import TaskView from './taskview/TaskView'
import UserView from './userview/UserView'

import Timeline from '../timeline/timeline'

import _ from 'underscore'

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

	render() {
		var viewContent;
		if(this.state.currentView == 'task'){
			viewContent = (
				<TaskView dispatch={this.props.dispatch} tasks={this.props.tasks} tasklog={this.props.tasklog} location={this.state.location}/>

			);
		}
		else if(this.state.currentView == 'user'){
			viewContent = (
				<UserView dispatch={this.props.dispatch}  location={this.state.location} />
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
				<Timeline viewBoxObject={{x: 0, y: 0, width: 500, height: 300}}/>
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
