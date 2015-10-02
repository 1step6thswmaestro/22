import React from "react"
import DateTime from './DateTime'

// Task edit template.
// If it looks pretty, then we can use same edite template for displaying existing tasks.

class MyInput extends React.Component{
		constructor(){
			super();
			this.state = {
				value: ''
			};
		}

		handleChange(evt){
			this.setState({
				value: evt.target.value
			});
		}

		clear(){
			this.setState({
				value: ''
			});
		}

		render(){
				return (
					<div className='form-group'>
						<input
							className="form-control"
							type="text"
							value={this.state.value}
							onChange={this.handleChange.bind(this)}
							placeholder={this.props.placeholder}
							defaultValue={this.props.initValue}
							/>
					</div>
				);
		}
};


class MyTextarea extends React.Component{
		constructor(){
			super();
			this.state = {
				value: ''
			};
		}

		handleChange(evt){
			this.setState({
				value: evt.target.value
			});
		}

		clear(){
			this.setState({
				value: ''
			});
		}

		render(){
				return (
					<textarea
						className="form-control"
						value={this.state.value}
						onChange={this.handleChange.bind(this)}
						placeholder={this.props.placeholder}
						defaultValue={this.props.initValue}
						/>
				);
		}
};

class TaskForm extends React.Component{
	constructor(){
		super();
		this.state = {
		};
	}

	isValid(){
		var name = undefined;
		if(this.refs.name.state)
			name = this.refs.name.state.value;

		var errors = {};
		// Do validity check for every form here.

		if (!name){
			errors['name'] = 'name' + ' field is required';
		}

		this.setState({errors: errors});

		var isValid = true;
		for (let error in errors) {
			isValid = false;
			break;
		}
		return isValid;
	}

	getFormData(){
		var name = this.refs.name.state.value;
		var description = this.refs.description.state.value;
		// Convert moment objects to Unix Time.
		var timestampDuedate = this.refs.dueDate.state.value.valueOf();
		return {name, description, timestampDuedate};
	}

	clearForm(){
		this.refs.name.clear();
		this.refs.description.clear();
		this.refs.dueDate.clear();
	}



	render() {
		// TODO: Layout Datetime Picker. Beacuse of bootstrap forcing body style, its original function does not work.
		// See original work from here. http://codepen.io/arqex/pen/BNRNBw

		return (
			<div className='form-group-attached'>
				<div className='row'>
					<div className='col-md-12'>
						<MyInput ref="name" placeholder="Task Name" />
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12'>
						<DateTime ref="dueDate" placeholder="Due Date"/>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12'>
						<div className='form-group'>
							<MyTextarea ref="description" placeholder="Task Description"/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TaskForm;
