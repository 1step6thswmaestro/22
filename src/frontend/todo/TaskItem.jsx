import React from 'react';
import moment from 'moment';
import MapImage from './MapImage';

class TaskItem extends React.Component{
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

	render() {
		var descStr = this.props.task.description || '';
		var rawMarkup = marked(descStr.toString(), {sanitize: true});
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
							<div className="task-startlocation">
								Created Location:
								{ this.props.task.locationstampCreated ? <MapImage location={this.props.task.locationstampCreated} /> : null }
							</div>
						</div>
						<div className="card-contents col-md-4">
							<div className="task-importance">
								중요도: {this.props.task.importance}
							</div>
							<div className="taskCreatedDate">
								생성일: {this.getReadableDate(this.props.task.timestampCreated)}
							</div>
							<div className="taskStartedDate">
								시작일: {this.getReadableDate(this.props.task.timestampStart)}
							</div>
							<div className="task-duedate">
								마감일: {this.getReadableDate(this.props.task.timestampDuedate)}
							</div>
						</div>
					</div>
					<div>
						<div className="btn-group">
							<button className="btn btn-check" onClick={this.props.onToggle}>
								<span className="glyphicon glyphicon-check"></span> 완료
							</button>
							<button className="btn btn-default" label="Remind me later" onClick={this.props.onPostpone}>
								<span className="glyphicon glyphicon-send"></span> 나중에 알림
							</button>
							<button className="btn btn-default" label="Discard this task" onClick={this.props.onDiscard}>
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
