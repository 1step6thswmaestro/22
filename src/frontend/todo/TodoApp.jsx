import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux';
import TaskForm from './TaskForm';
import { fetchList, makeNewItem, removeItem, updateItem } from './actions/tasks'
import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'
import MapImage from './MapImage'
import _ from 'underscore'



class TodoApp extends React.Component{
	// Define every task handling methods here. Subcomponents only use handles defined in here.
	// We have to avoid distributed handle definition to reduce complexity.
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

	discardTask(taskID){
		const { dispatch } = this.props;
		dispatch(removeItem(taskID));
	}

	updateTask(taskID, patch){
		const { dispatch } = this.props;
		dispatch(updateItem(taskID, patch));
		if(patch.timestampComplete){
			// When this function handles task completion.
			patch['locationstampComplete'] = this.state.location;
		}
		else{
			patch['locationstampComplete'] = null;
		}
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


// TODO: Redux's state.tasks should be mapped to TodoApp's state, not props.
// Ask 상현, why this is mapped to props. - Insik.
function mapStateToProps(state){
	return {
		tasks: state.tasks.list
	}
};

export default connect(
	mapStateToProps
)(TodoApp);
