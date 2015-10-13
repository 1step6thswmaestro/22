import React from "react"
import DateTime from '../dialog/DateTime'
import DateTimePicker from '../dialog/DateTimePicker'

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
			relatedLocation: 0
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
		var created = this.refs.created.getValue();
		var duedate = this.refs.duedate.getValue();
		return {name, description, duedate, created};
	}

	clearForm(){
		this.refs.name.clear();
		this.refs.description.clear();
		this.refs.created.clear();
		this.refs.duedate.clear();
		this.setState({
			relatedLocation: 0
		});
	}

	onToggleLocationButton(locName){
		var locList = ['home', 'school', 'work', 'etc'];
		var locIndex = 0;
		for (let i in locList){
			if (locList[i] == locName){
				locIndex = i;
				break;
			}
		}

		// Flip bit on locIndex
		var newValue = this.state.relatedLocation ^ (1 << (locList.length-1-locIndex));
		console.log(this.state.relatedLocation + '->' + newValue);
		this.setState({
			relatedLocation: newValue
		});
	}


	getLocButtonStates(relatedLocation){
		var locButtonState={
			home: "btn-default",
			school: "btn-default",
			work: "btn-default",
			etc: "btn-default"
		};

		if (relatedLocation % 2 == 1)
			locButtonState.etc = "btn-check";
		relatedLocation = Math.floor(relatedLocation / 2);

		if (relatedLocation % 2 == 1)
			locButtonState.work = "btn-check";
		relatedLocation = Math.floor(relatedLocation / 2);

		if (relatedLocation % 2 == 1)
			locButtonState.school = "btn-check";
		relatedLocation = Math.floor(relatedLocation / 2);

		if (relatedLocation % 2 == 1)
			locButtonState.home = "btn-check";
		relatedLocation = Math.floor(relatedLocation / 2);

		return locButtonState;
	}

	render() {
		// TODO: Layout Datetime Picker. Beacuse of bootstrap forcing body style, its original function does not work.
		// See original work from here. http://codepen.io/arqex/pen/BNRNBw

		var locButtonState = this.getLocButtonStates(this.state.relatedLocation);
		return (
			<div className='form-group-attached'>
				<div className='row'>
					<div className='col-md-12'>
						<MyInput ref="name" placeholder="Task Name" />
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12'>
						<DateTimePicker ref='created' default={Date.now()} label='created'/>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12'>
						<DateTimePicker ref='duedate' default={Date.now()} label='due date'/>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12'>
						<div className='form-group'>
							<MyTextarea ref="description" placeholder="Task Description"/>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-12'>
						작업 가능 장소 선택 :
						<div className="btn-group">
							<button className={"btn " + locButtonState.home} data-toggle="집" label="집" onClick={this.onToggleLocationButton.bind(this, 'home')}>
								<span className="glyphicon glyphicon-home"></span>
							</button>
							<button className={"btn " + locButtonState.school} data-toggle="학교" label="학교" onClick={this.onToggleLocationButton.bind(this, 'school')}>
								<span className="glyphicon glyphicon-book"></span>
							</button>
							<button className={"btn " + locButtonState.work} data-toggle="직장" label="직장" onClick={this.onToggleLocationButton.bind(this, 'work')}>
								<span className="glyphicon glyphicon-briefcase"></span>
							</button>
							<button className={"btn " + locButtonState.etc} data-toggle="기타" label="기타" onClick={this.onToggleLocationButton.bind(this, 'etc')}>
								<span className="glyphicon glyphicon-flash"></span>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TaskForm;
