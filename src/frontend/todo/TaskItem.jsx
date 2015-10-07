import React from 'react';
import moment from 'moment';
import MapImage from './MapImage';
import _ from 'underscore';

class TaskItem extends React.Component{
	constructor(props){
		super(props);
		this.state={
		}; // define variable 'state'.

		_.extend(this.state, props.task); // Init state.
	}
	getReadableDate(unixTimestamp){
		// Convert time format from DB (Unix Time), to readable format.
		var readableData = '';
		if(typeof unixTimestamp != 'undefined'){
			if (unixTimestamp == null){
				readableData = '미지정';
			}
			else{
				readableData = moment(unixTimestamp).format("YY/MM/DD HH:mm");
			}
		}
		else{
			readableData = '오류: 정의 안됨';
		}
		return readableData;
	}

	onCompleteToggle(){
		var patchRequest;

		if(this.state.timestampComplete == null){
			var timestamp = Date.now();
			patchRequest = {
				timestampComplete: timestamp
			};
		}
		else{
			patchRequest = {
				timestampComplete: null
			};
		}
		this.props.onUpdate(this.state._id, patchRequest);
		this.setState(patchRequest);
	}
	onDiscard(){
		this.props.onDiscard(this.state._id);
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

		var patchRequest;
		patchRequest = {
			relatedLocation: newValue
		}
		this.props.onUpdate(this.state._id, patchRequest);
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
		// console.log('In TaskItem render():');
		// console.log(this.state);
		var descStr = this.state.description || '';
		var rawMarkup = marked(descStr.toString(), {sanitize: true});
		var startDate, completeDate;
		var locButtonState = this.getLocButtonStates(this.state.relatedLocation);

		var completeButtonState = "btn-default";
		if(this.state.timestampComplete != null){
			startDate = (
				<div className="taskStartedDate">
					시작일: {this.getReadableDate(this.state.timestampStart)}
				</div>
			);
		}

		if(this.state.timestampComplete != null){
			completeDate = (
				<div className="task-complete-date">
					완료일: {this.getReadableDate(this.state.timestampComplete)}
				</div>
			);
			completeButtonState = "btn-check";
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h2 className="task-name">{this.state.name}</h2>
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
							<div className="task-startlocation">
								Created Location:
								{ this.state.locationstampCreated ? <MapImage location={this.state.locationstampCreated} /> : null }
								Complete Location:
								{ this.state.locationstampComplete ? <MapImage location={this.state.locationstampComplete} /> : null }
							</div>
						</div>
						<div className="card-contents col-md-4">
							<div className="task-importance">
								중요도: {this.state.importance}
							</div>
							<div className="taskCreatedDate">
								생성일: {this.getReadableDate(this.state.timestampCreated)}
							</div>
							{startDate}
							<div className="task-duedate">
								마감일: {this.getReadableDate(this.state.timestampDuedate)}
							</div>
							{completeDate}
						</div>
					</div>
					<div>
						<div className="btn-group">
							<button className={"btn " + completeButtonState} onClick={this.onCompleteToggle.bind(this)}>
								<span className="glyphicon glyphicon-check"></span> 완료
							</button>
							<button className="btn btn-default" label="Remind me later" onClick={this.props.onPostpone}>
								<span className="glyphicon glyphicon-send"></span> 나중에 알림
							</button>
							<button className="btn btn-default" label="Discard this task" onClick={this.onDiscard.bind(this)}>
								<span className="glyphicon glyphicon-trash"></span> 할 일 제거
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

};

export default TaskItem;
