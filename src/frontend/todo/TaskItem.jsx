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
			<div className="card panel panel-default">
				<div className="toggleview">
					<input
						className="toggle"
						type="checkbox"
						checked={this.props.task.timestampComplete!=""}
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
