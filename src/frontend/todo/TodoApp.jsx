import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux';

import TaskView from './taskview/TaskView'
import UserView from './userview/UserView'

import _ from 'underscore'

import DateTimePicker from './dialog/DateTimePicker'

import { setGlobalTime } from './actions/global'

import { fetchPrioritizedList } from './actions/tasks'

import { getLocation } from '../utility/location'

class TodoApp extends React.Component{
	constructor(){
		super();
		this.state = {
			location: '',
			currentView: 'task' // Save current user's view
		};
	}

	componentDidMount() {
		getLocation()
		.then(loc => {
			this.sendStillAlive();
			this.setState({
				location: loc
			});

			// Send still alive signal on every 5 min.
			// NOTE: When user inactive the tab in Chrome, the timer is paused.
			setInterval(this.sendStillAlive, 5*60*1000);
		});


	}

	sendStillAlive(){
		getLocation()
		.then(loc => {
			if (loc.lat == 0 || loc.lon == 0) {
				return
			}
			$.ajax({
				url: '/v1/connections/alive'
				, type: 'POST'
				, data:{
					lat: loc.lat,
					lon: loc.lon
				}
			})
			.then(
				result => {}
				, err => {console.log(err);}
			)
			if (loc.lat != this.state.location.lat || loc.lon != this.state.location.lon){
				// Only update when location is changed.
				this.setState({
					location: loc
				});
			}
		});
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
		var unixtime= time.valueOf();
		dispatch(setGlobalTime(unixtime));
		dispatch(fetchPrioritizedList());
	}

	render() {
		var viewContent;

		if(this.state.currentView == 'task'){
			viewContent = (
				<div>
				<DateTimePicker type='inline' onChange={this.setGlobalTime.bind(this)}/>
				<TaskView dispatch={this.props.dispatch} tasks={this.props.tasks} tasklog={this.props.tasklog} global={this.props.global}/>
				</div>
			);
		}
		else if(this.state.currentView == 'user'){
			viewContent = (
				<UserView dispatch={this.props.dispatch} global={this.props.global}/>
			);
		}

		return (
			<div className="task-container">
				<header>
					<h1>Give Me Task</h1>
					<div className="view-toggle" onClick={this.toggleView.bind(this)} onTouchStart={this.toggleView.bind(this)}>
						Click HERE to Toggle UserView/TaskView
					</div>
				</header>
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
