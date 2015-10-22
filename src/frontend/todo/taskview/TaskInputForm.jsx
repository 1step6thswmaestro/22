import React from "react"
import DateTime from "../dialog/DateTime"
import DateTimePicker from "../dialog/DateTimePicker"
import { modifyItem } from '../actions/tasks';

// This class make card shaped for the new task which is waiting for user input.
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
			<input
				className="form-control"
				type="text"
				value={this.state.value}
				onChange={this.handleChange.bind(this)}
				placeholder={this.props.placeholder}
			/>
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
			/>
		);
	}
};

// Task add and modify template.
class TaskInputForm extends React.Component{
	constructor(){
		super();
		this.state = {
			relatedLocation: 0,
			modifyMode: false,
			task: null,
		};
	}

	handleSubmitModify() {
		let modifiedTask = this.getFormData();
		modifiedTask['_id'] = this.state.task._id;

	  	const { dispatch } = this.props;
		dispatch(modifyItem(modifiedTask));
	}

	handleSubmitAdd() {
		if (this.isValid()) {
			this.props.onTaskSubmit(this.getFormData());
			this.clearForm();
		}
		else{
			var errormsg='';
			var errors = this.state.errors;
			for (var error in errors) {
				errormsg=errormsg+errors[error]+'\n';
			}
			alert('Error: Check your input\n'+errormsg);
		}
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

	onModifyRequest(task){
		this.setState({
			modifyMode: true,
			task: task,
		});

		this.refs.name.setState({
			value: task.name
		});

		this.refs.description.setState({
			value: task.description
		});

		this.refs.created.setDate(task.created);
		this.refs.duedate.setDate(task.duedate);
	}

	setDate(date){
		this.refs.created.setDate(date);
		this.refs.duedate.setDate(this.refs.created.getValue() + (24*60*60*1000));
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
		// NOTE: Check if there is snippet for assigning location from address or getting current location. -->
		// TODO: I want to fire onClick event when user press ctrl+enter key.
		var locButtonState = this.getLocButtonStates(this.state.relatedLocation);
		var modifyMode = this.state.modifyMode;

		return (
			<div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-contents">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
								<h4 className="modal-title" id="gridSystemModalLabel">{modifyMode?"할 일 수정하기":"새로운 할 일 추가"}</h4>
							</div>
							<div className="modal-body">
								<div className="task-box">
									<div className="form-group-attached">
										<div className="row">
											<div className="col-md-12">
												<MyInput ref="name" placeholder="Task Name" existingValue={modifyMode?this.state.task.name:""} />
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<DateTimePicker ref="created" default={this.props.global.time} label='created'/>
											</div>
											<div className="col-md-6">
												<DateTimePicker ref="duedate" default={this.props.global.time+(24*60*1000)} label='due date'/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12">
												<div className="form-group">
													<MyTextarea ref="description" placeholder="Task Description" defaultValue={modifyMode?this.state.task.description:""} />
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-md-12">
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
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">취소</button>
								<button type="button" className="btn btn-primary" onClick={modifyMode?this.handleSubmitModify.bind(this):this.handleSubmitAdd.bind(this)} data-dismiss="modal">완료</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default TaskInputForm;
