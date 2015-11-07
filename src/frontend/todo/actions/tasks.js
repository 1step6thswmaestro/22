'use strict'

import { type } from './tasks_decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'

var TaskStateType = require('../../../constants/TaskStateType');

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
			url: `/v1/tasks/prioritized/${getState().config.priorityStrategy}`
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
			item => dispatch({type: type.TASK_RECV_ITEM, item, tid})
			, err => dispatch({type: type.TASK_ERROR, err})
		);
	}
}

export function setTaskProperty(item, body){
	return function(dispatch){
		$.ajax({
			url: `v1/tasks/${item._id}/set`
			, type: 'put'
			, data: body
		})
		.then(function(result){
			console.log({result});
			dispatch({type: type.TASK_RECV_ITEM, item: result.task});
		})
	}
}

export function modifyItem(task){
	return function(dispatch) {
		dispatch({
			type: type.TASK_REQ_UPDATE,
			item: task
		});

		return request({
			url: '/v1/tasks/modify'
			, type: 'post'
			, data: task
		})
		.then(result => {
			dispatch({type: type.TASK_RECV_ITEM, task});
		}, err => {
			dispatch({type: type.TASK_ERROR, err});
		});
	}
}

export function startItem(task){
	return updateState(task, TaskStateType.named.start);
}

export function pauseItem(task){
	return updateState(task, TaskStateType.named.pause);
}

export function resumeItem(task){
	return updateState(task, TaskStateType.named.resume);
}

export function postponeItem(item){
	return updateState(task, TaskStateType.named.postpone);
}

export function completeItem(task){
	return updateState(task, TaskStateType.named.complete);
}

function updateState(task, actionType){
	return function(dispatch, getState){
		dispatch({
			type: type.TASK_REQ_UPDATE
			, item: task
		})

		return request({
			url: `/v1/tasks/${task._id}/${actionType.command}`
			, type: 'put'
			, data: {
				time: getState().global.time
			}
		})
		.then(result => {
			console.log(result);
			dispatch({type: type.TASK_RECV_ITEM, item: result.task});
			dispatch({type: type.TASK_RECV_LOG, item: result.log, taskId: result.task._id});
		}, err => {
			dispatch({type: type.TASK_ERROR, err});
			dispatch({type: type.TASK_RECV_ITEM, item: task});
		});
	}
}

export function getRemainTime(task) {
	var remainTime = ((new Date(task.duedate) - Date.now()) / 1000 / 60 / 60).toFixed(1);
	var estimationTime = task.estimation;

	let result = (remainTime - estimationTime).toFixed(1);
	return result;
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
