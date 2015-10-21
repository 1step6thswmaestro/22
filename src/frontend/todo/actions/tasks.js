'use strict'

import { type } from './tasks_decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'

var TaskLogType = require('../../../constants/TaskLogType');
var TaskState = require('../../../constants/TaskState');


export function fetchOngoingList(){
	return (dispatch, getState) => {
		dispatch({
			type: type.TASK_REQ_ONGOING_LIST
		});

		return $.ajax({
			url: '/v1/tasks/ongoing'
			, type: 'get'
			// Seems unnecessary.
			//, data:{
			//	time: getState().global.time
			//}
		})
		.then(
			result => {
				dispatch({type: type.TASK_RECV_ONGOING_LIST, list: result.list});
			}
			, err => dispatch({type: type.TASK_ERROR, err})
		)
	}
}

export function fetchList(){
	return (dispatch, getState) => {
		dispatch({
			type: type.TASK_REQ_LIST
		});
		return $.ajax({
			url: '/v1/tasks'
			, type: 'get'
			, data:{
				time: getState().global.time
			}
		})
		.then(
			result => {
				dispatch({type: type.TASK_RECV_LIST, list: result.list});
				dispatch({type: type.TASK_RECV_LIST_PRIORITIZED, list: result.plist})
			}
			, err => dispatch({type: type.TASK_ERROR, err})
		)
	}
}

export function fetchPrioritizedList(){
	return (dispatch, getState) => {
		dispatch({
			type: type.TASK_REQ_PLIST
		});
		return $.ajax({
			url: '/v1/tasks/prioritized'
			, type: 'get'
			, data:{
				time: getState().global.time
			}
		})
		.then(
			result => {
				dispatch({type: type.TASK_RECV_LIST_PRIORITIZED, list: result.plist})
			}
			, err => dispatch({type: type.TASK_ERROR, err})
		)
	}
}

let count = 0;
export function makeNewItem(item){
	return function(dispatch){
		let tid = ++count;
		// We need tid even if we already have task's id in Task model.
		// We get task's id only after server successfuly processed POST requst.
		// When the requst returns completed task object, we replace temporary
		// task object with recieved task object.
		// We use tid to locate the tmp task in the list.
		item.tid = tid;

		dispatch({
			type: type.TASK_REQ_NEWITEM
			, item: item
		});

		return request({
			url: '/v1/tasks'
			, type: 'post'
			, data: item
		})
		.then(
			item => dispatch({type: type.TASK_RECV_NEWITEM, item, tid})
			, err => dispatch({type: type.TASK_ERROR, err})
		);
	}
}

export function modifyItem(task){
	return request({
		url: '/v1/tasks/modify'
		, type: 'post'
		, data: task
	})
	.then(result => {
		dispatch({type: type.TASK_MODIFY_ITEM, task});
	}, err => {
		dispatch({type: type.TASK_ERROR, err});
	});
}

export function startItem(task){
	return updateStateWithAction(task, TaskLogType.named.start);
}

export function pauseItem(task){
	return updateStateWithAction(task, TaskLogType.named.pause);
}

export function resumeItem(task){
	return updateStateWithAction(task, TaskLogType.named.resume);
}

export function postponeItem(item){
	return updateStateWithAction(task, TaskLogType.named.postpone);
}

export function completeItem(task){
	return updateStateWithAction(task, TaskLogType.named.complete);
}

function updateStateWithAction(task, actionType){
	return function(dispatch, getState){

		// Show loading symbol until we get server response.
		dispatch({
			type: type.TASK_REQ_UPDATE
			, item: task
		})

		return request({
			url: `/v1/tasks/${task._id}/${actionType.name}`
			, type: 'put'
			, data: {
				time: getState().global.time
			}
		})
		.then(result => {
			dispatch({
				type: type.TASK_RECV_UPDATED_ITEM,
				item: result.task,
				isPrevStateStarted: task.state == TaskState.named.started.id,
				isUpdated: true
			});
			dispatch({type: type.TASK_RECV_LOG, item: result.log, taskId: result.task._id});
		}, err => {
			dispatch({type: type.TASK_ERROR, err});

			// Even if request for state change failed. We change state from loading to finished.
			dispatch({
				type: type.TASK_RECV_UPDATED_ITEM,
				item: task,
				isPrevStateStarted: task.state == TaskState.named.started.id,
				isUpdated: false
			});
		});
	}
}

export function removeItem(task){
	return function(dispatch){
		// No dispatch for remove request because there is no need to change state
		// until we get response from server.
		return $.ajax({
			url: `/v1/tasks/${task._id}`
			, type: 'delete'
		})
		.then(
			dispatch({type: type.TASK_REMOVE_ITEM, taskId: task._id})
			, err => dispatch({type: type.TASK_ERROR, err})
		);
	}
}

function request(requestArg){
	return getLocation()
	.then(loc => {
		requestArg.data = requestArg.data || {};
		_.extend(requestArg.data, {loc: loc})
		return $.ajax(requestArg);
	})
}
