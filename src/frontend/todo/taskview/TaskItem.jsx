import React from 'react';
import MapImage from '../dialog/MapImage';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import { completeItem, removeItem, postponeItem } from '../actions/tasks';

class TaskItem extends React.Component{
	constructor(){
		super();
	}
	
	complete(){
		dispatch(completeItem(this.props.task._id));
	}

	discard(){
		const { dispatch } = this.props;
		dispatch(removeItem(this.props.task._id));
	}

	postpone(){
		const { dispatch } = this.props;
		dispatch(postponeItem(this.props.task._id));	
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
		var descStr = this.props.task.description || '';
		var rawMarkup = marked(descStr.toString(), {sanitize: true});
		var startDate, completeDate;
		var locButtonState = this.getLocButtonStates(this.props.task.relatedLocation);

		var completeButtonState = "btn-default";
		if(this.props.task.timestampComplete != null){
			startDate = (
				<div className="taskStartedDate">
					시작일: {getReadableDate(this.props.task.timestampStart)}
				</div>
			);
		}

		if(this.props.task.timestampComplete != null){
			completeDate = (
				<div className="task-complete-date">
					완료일: {getReadableDate(this.props.task.timestampComplete)}
				</div>
			);
			completeButtonState = "btn-check";
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h2 className="task-name">{this.props.task.name}</h2>
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
								{ this.props.task.locationstampCreated ? <MapImage location={this.props.task.locationstampCreated} /> : null }
								Complete Location:
								{ this.props.task.locationstampComplete ? <MapImage location={this.props.task.locationstampComplete} /> : null }
							</div>
						</div>
						<div className="card-contents col-md-4">
							<div className="task-importance">
								중요도: {this.props.task.importance}
							</div>
							<div className="taskCreatedDate">
								생성일: {getReadableDate(this.props.task.timestampCreated)}
							</div>
							{startDate}
							<div className="task-duedate">
								마감일: {getReadableDate(this.props.task.timestampDuedate)}
							</div>
							{completeDate}
						</div>
					</div>
					<div>
						<div className="btn-group">
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

};

export default TaskItem;
