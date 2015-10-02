import React from 'react';
import moment from 'moment';

class TaskItem extends React.Component{
	getReadableDate(unixTimestamp){
		// Convert time format from DB (Unix Time), to readable format.
		var readableData = '';
		if(typeof unixTimestamp != 'undefined'){
			if (unixTimestamp == null){
				readableData = '미지정';
			}
			else{
				console.log('getreadable date from:' + unixTimestamp);
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
			<div className="card panel panel-default">
				<div className="toggleview">
					<input
						className="toggle"
						type="checkbox"
						checked={this.props.task.timestampComplete!=null}
						onChange={this.props.onToggle}
						/>
				</div>
				<div className="card-contents">
					<div className="task-name">
						<h2>{this.props.task.name}</h2>
					</div>
					<div className="task-importance">
						IMPORTANCE: {this.props.task.importance}
					</div>
					<div className="task-duedate">
						DUE: {this.getReadableDate(this.props.task.timestampDuedate)}
					</div>
					<div className="taskCreatedDate">
						CREATED: {this.getReadableDate(this.props.task.timestampCreated)}
					</div>
					<div className="taskStartedDate">
						STARTED: {this.getReadableDate(this.props.task.timestampStart)}
					</div>
					<div className="taskStartedDate">
						COMPLETED: {this.getReadableDate(this.props.task.timestampComplete)}
					</div>
					<div className="task-description">
						<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
					</div>
				</div>
				<div className="card-control">
					<div className="toolbar">
						<button className="button postpone" label="Remined me later" onClick={this.props.onPostpone}/>
						<button className="button discard" label="Discard this task" onClick={this.props.onDiscard} />
					</div>
				</div>
			</div>
		);
	}

};

export default TaskItem;
