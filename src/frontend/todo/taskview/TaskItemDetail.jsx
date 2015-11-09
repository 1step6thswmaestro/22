import React from 'react';
import DocView from './DocView';
import MapImage from '../dialog/MapImage';
import LocationAddress from '../dialog/LocationAddress';
import _ from 'underscore';
import { getReadableDate } from '../../utility/date'
import { startItem, pauseItem, completeItem, removeItem, postponeItem, getRemainTime } from '../actions/tasks';
import If from '../../utility/if'
var TaskStateType = require('../../../constants/TaskStateType');
import { fetchTaskLog } from '../actions/tasklog';

class TaskItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TaskItemDetail';
		
		const { dispatch } = this.props;
		dispatch(fetchTaskLog(this.props.task));
    }

	complete(){
		const { dispatch } = this.props;
		dispatch(completeItem(this.props.task));
	}

	start() {
		const { dispatch } = this.props;
		dispatch(startItem(this.props.task));
	}

	pause() {
		const { dispatch } = this.props;
		dispatch(pauseItem(this.props.task));
	}

	discard(){
		const { dispatch } = this.props;
		dispatch(removeItem(this.props.task));
	}

	postpone(){
		const { dispatch } = this.props;
		dispatch(postponeItem(this.props.task));
	}

	reset(){
		$.ajax(`/v1/tasktoken/task/${this.props.task._id}/reset`);
	}

	getCreatedLocation(){
		let task = this.props.task;
		let logs = this.props.tasklog;

		let log_created = _.findWhere(logs, {taskId: task._id});
		let location;

		if(log_created){
			let longitude = log_created.loc.coordinates[0];
			let latitude = log_created.loc.coordinates[1];
			let location = {longitude, latitude};
			return (<LocationAddress location={location} />);
		}
	}


	toggleLocationButton(locName){
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

	expand(){
		const { dispatch } = this.props;

		var newVal = (this.state.isExpanded||0) ^ 1;
		this.setState({
			isExpanded: newVal
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


	getRemainTime() {
		let time = Math.floor(getRemainTime(this.props.task, this.props.tasklog));
		
		let result = "여유시간: ";
		if(time <= 0) {
			result = "여유시간 부족!";
		}
		else if(time <= 1) {
			result += "1시간 이하";
		}
		else if(time > 25) {
			result += ("약 "+Math.floor((time/24))+"일 "+(time%24)+"시간");
		}
		else{
			result += ("약 "+time+"시간");
		}
		return result;
	}

    render(){
		let task = this.props.task || {};
		let locButtonState = this.getLocButtonStates(task.relatedLocation);

		let actionButtons = [];
		if(task.state != TaskStateType.named.complete.id){
			if(task.state != TaskStateType.named.start.id){
				actionButtons.push((
					<button className="btn btn-default" onClick={this.start.bind(this)}>
						<span className="glyphicon glyphicon-play"></span> 시작
					</button>
				))
			}
			else{
				actionButtons.push((
					<button className="btn btn-check" onClick={this.pause.bind(this)}>
						<span className="glyphicon glyphicon-play"></span> 일시 정지
					</button>
				))
			}
			
			if(task.state != TaskStateType.named.complete.id){
				actionButtons.push((
					<button className="btn btn-default" onClick={this.complete.bind(this)}>
						<span className="glyphicon glyphicon-check"></span> 완료
					</button>
				))
			}
		}
		if(task.state == TaskStateType.named.complete.id){
			actionButtons.push((
				<button className="btn btn-check">
					<span className="glyphicon glyphicon-check"></span> 완료
				</button>
			))
		}

		let locationPresetButtons = (
			<div className="btn-group">
				<button className={"btn " + locButtonState.home} data-toggle="집" label="집" onClick={this.toggleLocationButton.bind(this, 'home')}>
					<span className="glyphicon glyphicon-home"></span>
				</button>
				<button className={"btn " + locButtonState.school} data-toggle="학교" label="학교" onClick={this.toggleLocationButton.bind(this, 'school')}>
					<span className="glyphicon glyphicon-book"></span>
				</button>
				<button className={"btn " + locButtonState.work} data-toggle="직장" label="직장" onClick={this.toggleLocationButton.bind(this, 'work')}>
					<span className="glyphicon glyphicon-briefcase"></span>
				</button>
				<button className={"btn " + locButtonState.etc} data-toggle="기타" label="기타" onClick={this.toggleLocationButton.bind(this, 'etc')}>
					<span className="glyphicon glyphicon-flash"></span>
				</button>
			</div>
		);

		let important = this.props.task.important;

		return (
			<div className="task-item-detail-container">
				<div className='task-item-detail'>
					<div className="panel panel-transparent">
						<div className='panel-body'>
							<div className="form-group-attached">
								<div className='row'>
									<div className='col-sm-6'>
										<div className='col-xs-4'>
											<div className="form-group form-group-default">
												<label>중요도</label>
												<If test={important}>
													<div>
														<div className='table-item-header property' onClick={this.props.setImportant.bind(this, false)}>
															<i className='fa fa-exclamation'></i>
														</div>
														수행 생략 불가능
													</div>
												</If>
												<If test={!important}>
													<div>
														<div className='table-item-header property' onClick={this.props.setImportant.bind(this, true)}>
															<i className='fa fa-circle-o'></i>
														</div>
														수행 생략 가능
													</div>
												</If>
							                </div>
										</div>
										<div className='col-xs-4'>
											<div className="form-group form-group-default">
												<label>속성2</label>
												<div className='table-item-header property' onClick={this.props.setImportant.bind(this, true)}>
													<i className='fa fa-check-circle'></i>
												</div>
						                	</div>
										</div>
										<div className='col-xs-4'>
											<div className="form-group form-group-default">
												<label>속성3</label>
												<div className='table-item-header property' onClick={this.props.setImportant.bind(this, true)}>
													<i className='fa fa-check-circle'></i>
												</div>
											</div>
										</div>
									</div>
									<div className='col-sm-6'>
										<div className="form-group form-group-default">
											<label>작업 가능 장소 선택</label>
											{locationPresetButtons}
										</div>
									</div>
								</div>
				                <div className='row'>
				                	<div className='col-md-6'>
						                <div className="form-group form-group-default">
						                	<label>생성 위치</label>
						                	{ this.getCreatedLocation() }
						                </div>
				                	</div>
				                	<div className='col-md-6'>
						                <div className="form-group form-group-default">
						                	<label>완료 위치</label>
						                	{ task.locationstampComplete ? <LocationAddress location={task.locationstampComplete} /> : null }
						                </div>
				                	</div>
				                </div>
				                <div className='row'>
				                	<div className='col-md-3'>
						                <div className="form-group form-group-default">
											<label>생성일</label>
											{getReadableDate(task.created)}
						                </div>
				                	</div>
				                	<div className='col-md-3'>
						                <div className="form-group form-group-default">
											<label>마감일</label>
											{getReadableDate(task.duedate)}
						                </div>
				                	</div>
				                	<div className='col-md-3'>
						                <div className="form-group form-group-default">
											<label>소요시간</label>
											{ task.estimation } 시간
						                </div>
				                	</div>
				                	<div className='col-md-3'>
						                <div className="form-group form-group-default">
											<label>여유시간</label>
											{this.getRemainTime()}
						                </div>
				                	</div>
				                </div>
				                <div className='row'>
				                	<div className='col-md-12'>
				                		<div className="form-group form-group-default">
				                			<div className="btn-group">
												{actionButtons}
												<button className="btn btn-default" label="Remind me later" onClick={this.postpone.bind(this)}>
													<span className="glyphicon glyphicon-send"></span> 나중에 알림
												</button>
												<button className="btn btn-default" label="Discard this task" onClick={this.props.onTaskModify}>
													<span className="glyphicon glyphicon-pencil"></span> 수정
												</button>
												<button className="btn btn-default" label="Discard this task" onClick={this.discard.bind(this)}>
													<span className="glyphicon glyphicon-trash"></span> 할 일 제거
												</button>
												<button className="btn btn-warning" label="Discard this task" onClick={this.reset.bind(this)}>
													<span className="fa fa-sun-o"></span> reset
												</button>
											</div>
				                		</div>
				                	</div>
				                </div>
				                <div className='row'>
				                	<div className='col-md-12'>
				                		<div className="form-group form-group-default">
				                			<div className='btn-group'>
												<a href={`/v1/tasktoken/task/${task._id}/`} target='_blank' className="btn btn-default">
													<span className="fa fa-search"></span> tokens
												</a>
												<a href={`/v1/tasktoken/time/${this.props.global.time?this.props.global.time:''}`} target='_blank' className="btn btn-default">
													<span className="fa fa-search"></span> tokens by time
												</a>
												<a href={`/v1/tasklog/task/${task._id}/`} className="btn btn-default" target='_blank'>
													<span className="fa fa-search"></span> show logs
												</a>
											</div>
										</div>
				                	</div>
				                </div>
				                <div className='row'>
				                	<div className='col-md-12'>
					                	<If test={task != null}>
					                		<div className="form-group form-group-default">
												<DocView taskID={task._id} keyword={task.name+task.description} user_id={task.userId}/>
											</div>
										</If>
				                	</div>
				                </div>
					        </div>
					    </div>
					</div>
				</div>
			</div>
		);
	}
}

export default TaskItemDetail;
