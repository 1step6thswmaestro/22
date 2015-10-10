'use strict'

import { type } from './tasklog_decl';
import _ from 'underscore'

export function fetchTaskLog(task){
	return (dispatch) => {
		dispatch({
			type: type.TASK_REQ_LOG
		});

		return $.ajax(`/v1/tasklog/${task._id}`)
		.then(
			result => {
				dispatch({type: type.TASK_RECV_LOGS, taskId: task._id, list: result});
			}
			, err => dispatch({type: type.TASK_LOG_ERROR, err})
		)
	}
}