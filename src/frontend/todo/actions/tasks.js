'use strict'

import { type } from './tasks_decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'

console.log('type', type);

export function fetchList(){
	return (dispatch) => {
		dispatch({
			type: type.TASK_REQ_LIST
		});

		return $.ajax('/v1/tasks')
		.then(
			result => {
				dispatch({type: type.TASK_RECV_LIST, list: result.list});
				dispatch({type: type.TASK_RECV_LIST_PRIORITIZED, list: result.plist})
			}
			, err => disptch({type: type.TASK_ERROR, err})
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

export function postponeItem(item){
	return function(dispatch){
		dispatch(type.TASK_POSTPONE_ITEM)

		return request({
			url: `/v1/task/${item.id}/postpone`
			, type: 'put'
		})
		.then(_updateList, _error);
	}
}

export function completeItem(task){
	return request({
		url: `/v1/tasks/${task.id}/complete`
		, type: 'put'
	})
	.then(_updateItem, _error);
}

function request(requestArg){
	return getLocation()
	.then(function(loc){
		requestArg.data = requestArg.data || {};
		_.extend(requestArg.data, {loc: loc})
		return $.ajax(requestArg);
	})
}

function _updateList(result){
	if(result.list){
		dispatch({
			type: type.TASK_RECV_LIST
			, list: result.list
		})
	}

	if(result.plist){
		dispatch({
			type: type.TASK_RECV_LIST_PRIORITIZED
			, list: plist
		})
	}
}

function _updateItem(item){
	dispatch({type: type.TASK_RECV_ITEM, item})
}

function _error(err){
	dispatch({type: type.TASK_ERROR, err})
}