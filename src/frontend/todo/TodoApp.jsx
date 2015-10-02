import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux';
import TaskForm from './TaskForm';
import { fetchList, makeNewItem, removeItem } from './actions/tasks'
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from './MapImage'
import _ from 'underscore'



class TodoApp extends React.Component{
	constructor(){
		super();
		this.state = {
			location: '',
			tasks: []
		};
	}

	componentDidMount() {
		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(position){
				this.setState({
					location: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}
				});
			}.bind(this));
		}

		const { dispatch } = this.props;
		dispatch(fetchList());
	}


	handleTaskSubmit(taskPart) {
		var taskWhole = taskPart;
		// Put current location info into appropriate field.
		taskWhole['locationstampCreated'] = this.state.location; // When this function handles task creation.
		const { dispatch } = this.props;
		dispatch(makeNewItem(taskWhole));
	}

	discard(task){
		const { dispatch } = this.props;
		dispatch(removeItem(task));
	}

	toggle(todoToToggle) {
		// Implement toggle routine.
		// For example:
		// UPDATE VIEW
		// SEND THE EVENT TO SERVER.
		alert('Check Clicked');
	}

	render() {
		var tasks = this.props.tasks.list;
		var taskItems = _.map(tasks, function (task) {
			return (
				<TaskItem
					key={task.id}
					task={task}
					onDiscard={this.discard.bind(this, task)} />)
		}, this);

		return (
			<div className="task-container">
				<header>
					<h1>Give Me Task</h1>
				</header>
				<div className='current-location'>
					Current Location:
					{ this.state.location ? <MapImage location={this.state.location} /> : null }
				</div>

				<div className="task-box">
					<div className="row">
						<div className="col-md-4">
							<TaskInputForm
								onTaskSubmit={this.handleTaskSubmit.bind(this)}
								onToggle={this.toggle.bind(this)}
								onDiscard={this.discard.bind(this)}
							/>
						</div>
					</div>
				</div>
				<div className="task-list">
					{taskItems}
				</div>
			</div>
		);
	}
};

function mapStateToProps(state){
	return {
		tasks: Object.assign({}, state, {list: _.filter(state.tasks.list, item => !item.removed)})
	}
};

export default connect(
	mapStateToProps
)(TodoApp);
