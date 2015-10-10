import React from 'react';
import MapImage from '../dialog/MapImage';
import LocationAddress from '../dialog/LocationAddress';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import { completeItem, removeItem, postponeItem } from '../actions/tasks';

class TaskItem extends React.Component{
	constructor(){
		super();
		this.state = {};
	}
	
	complete(){
		dispatch(completeItem(this.props.task._id));
	}

	onStartToggle() {
		var patchRequest;
		if (this.state.taskOnProcess == false) {
			var timestamp = Date.now();
			patchRequest = {
				timestampStart: timestamp,
				taskOnProcess: true
			};
		}
		else {
			patchRequest = {
				taskOnProcess: false
			};
		}
		this.props.onUpdate(this.state._id, patchRequest);
		this.setState(patchRequest);
	}

	discard(){
		const { dispatch } = this.props;
		dispatch(removeItem(this.props.task));
	}

	postpone(){
		const { dispatch } = this.props;
		dispatch(postponeItem(this.props.task));	
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
		const { dispatch } = this.props;
		dispatch(updateRelatedLocation(relatedLocation ^ (1 << (locList.length-1-locIndex))));
	}

	onExpandToggle(){
		var newVal = (this.state.isExpanded||0) ^ 1;
		this.setState({
			isExpanded: newVal
		})
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

	getDetailView(){
		var task = this.props.task;
		var descStr = task.description || '';
		var rawMarkup = marked(descStr.toString(), {sanitize: true});
		var startDate, completeDate;
		var locButtonState = this.getLocButtonStates(task.relatedLocation);

		var completeButtonState = "btn-default";
		var processButtonState = "btn-default";
		if(task.timestampStart != null){
			startDate = (
				<div className="taskStartedDate">
					시작일: {getReadableDate(task.timestampStart)}
				</div>
			);
		}

		if(task.timestampComplete != null){
			completeDate = (
				<div className="task-complete-date">
					완료일: {getReadableDate(task.timestampComplete)}
				</div>
			);
			completeButtonState = "btn-check";
		}

		if (task.taskOnProcess == true) {
			processButtonState = "btn-check";
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading" onClick={this.onExpandToggle.bind(this)}>
					<h2 className="task-name">{task.name}</h2>
				</div>
				<div className="panel-body">
					<div className="row">
						<div className="col-md-8">
							<div className="task-description">
								<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
							</div>
							<div className="task-relatedLocation">
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
							<LocationAddress location={task.locationstampCreated} />
							<div className="task-startlocation">
								생성 시 위치:
								{ task.locationstampCreated ? <LocationAddress location={task.locationstampCreated} /> : null }
								완료 위치:
								{ task.locationstampComplete ? <LocationAddress location={task.locationstampComplete} /> : null }
							</div>
						</div>
						<div className="card-contents col-md-4">
							<div className="task-importance">
								중요도: {task.importance}
							</div>
							<div className="taskCreatedDate">
								생성일: {getReadableDate(task.timestampCreated)}
							</div>
							{startDate}
							<div className="task-duedate">
								마감일: {getReadableDate(task.timestampDuedate)}
							</div>
							{completeDate}
						</div>
					</div>
					<div>
						<div className="btn-group">
							<button className={"btn " + processButtonState} onClick={this.onStartToggle.bind(this)}>
								<span className="glyphicon glyphicon-play"></span> 시작
							</button>
							<button className={"btn " + completeButtonState} onClick={this.complete.bind(this)}>
								<span className="glyphicon glyphicon-check"></span> 완료
							</button>
							<button className="btn btn-default" label="Remind me later" onClick={this.postpone.bind(this)}>
								<span className="glyphicon glyphicon-send"></span> 나중에 알림
							</button>
							<button className="btn btn-default" label="Discard this task" onClick={this.discard.bind(this)}>
								<span className="glyphicon glyphicon-trash"></span> 할 일 제거
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	getSimpleView(){
		var task = this.props.task;
		var descStr = task.description || '';
		var rawMarkup = marked(descStr.toString(), {sanitize: true});
		var startDate, completeDate;
		var locButtonState = this.getLocButtonStates(task.relatedLocation);

		var completeButtonState = "btn-default";
		var processButtonState = "btn-default";
		if(task.timestampStart != null){
			startDate = (
				<div className="taskStartedDate">
					시작일: {getReadableDate(task.timestampStart)}
				</div>
			);
		}

		if(task.timestampComplete != null){
			completeDate = (
				<div className="task-complete-date">
					완료일: {getReadableDate(task.timestampComplete)}
				</div>
			);
			completeButtonState = "btn-check";
		}

		if (task.taskOnProcess == true) {
			processButtonState = "btn-check";
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading" onClick={this.onExpandToggle.bind(this)}>
					<h2 className="task-name">{task.name}</h2>
				</div>
				<div className="panel-body">
					<div>
						<div className="btn-group">
							<button className={"btn " + processButtonState} onClick={this.onStartToggle.bind(this)}>
								<span className="glyphicon glyphicon-play"></span> 시작
							</button>
							<button className={"btn " + completeButtonState} onClick={this.complete.bind(this)}>
								<span className="glyphicon glyphicon-check"></span> 완료
							</button>
							<button className="btn btn-default" label="Remind me later" onClick={this.postpone.bind(this)}>
								<span className="glyphicon glyphicon-send"></span> 나중에 알림
							</button>
							<button className="btn btn-default" label="Discard this task" onClick={this.discard.bind(this)}>
								<span className="glyphicon glyphicon-trash"></span> 할 일 제거
							</button>
						</div>
					</div>
				</div>
			</div>
		);

	}

	render() {
		// console.log('In TaskItem render():');
		// console.log(this.state);
		var viewContent;
		if (this.state.isExpanded == 1){
			viewContent = this.getDetailView();
		}
		else{
			viewContent = this.getSimpleView();
		}
		return viewContent;

	}

};

export default TaskItem;
