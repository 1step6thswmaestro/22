import React from 'react';

class TaskItem extends React.Component{
	getReadableDate(stdDate){

		// Convert time format from DB, to readable format.
		// stdDate = "2015-09-17T01:00:00.000Z"
		var readableData = '';

		if(typeof stdDate != 'undefined'){
				readableData = stdDate.replace(
				/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}\.000Z/,
				function($0,$1,$2,$3,$4,$5){
					return $2+"월 "+$3+"일, " + $4%12+":"+$5+(+$4>12?" PM":" AM")
				});
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
