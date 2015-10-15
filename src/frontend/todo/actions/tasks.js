'use strict'

import { type } from './tasks_decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'

export function fetchList(){
	return (dispatch, getState) => {
		dispatch({
			type: type.TASK_REQ_LIST
		});

		console.log(getState());

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

		console.log(getState());

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
			item => dispatch({type: type.TASK_RECV_ITEM, item, tid})
			, err => dispatch({type: type.TASK_ERROR, err})
		);
	}
}

export function startItem(task){
	return updateState(task, 'start');
}

export function pauseItem(task){
	return updateState(task, 'pause');
}

export function resumeItem(task){
	return updateState(task, 'resume');
}

export function postponeItem(item){
	return updateState(task, 'postpone');
}

export function completeItem(task){
	return updateState(task, 'complete');
}

function updateState(task, state){
	return function(dispatch, getState){
		dispatch({
			type: type.TASK_REQ_UPDATE
			, item: task
			, doc: {state: state}
		})

		return request({
			url: `/v1/tasks/${task._id}/${state}`
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



