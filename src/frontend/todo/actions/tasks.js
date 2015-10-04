require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

export const TASK_REQ_LIST = 'TASK_REQ_LIST';
export const TASK_RECV_LIST = 'TASK_RECV_LIST';
export const TASK_REQ_NEWITEM = 'TASK_REQ_NEWITEM';
export const TASK_RECV_ITEM = 'TASK_RECV_ITEM';
export const TASK_ERROR = 'TASK_ERROR';
export const TASK_REMOVE_ITEM = 'TASK_REMOVE_ITEM';



export function fetchList(){
	return (dispatch, getState) => {
		dispatch({
			type: TASK_REQ_LIST
		});

		return $.ajax('/v1/tasks')
		.then(
			list => dispatch({type: TASK_RECV_LIST, list})
			, err => disptch({type: TASK_ERROR, err})
		)
	}
}

let count = 0;
export function makeNewItem(item){
	return function(dispatch){
		let tid = ++count;
		item.tid = tid;
		dispatch({
			type: TASK_REQ_NEWITEM
			, item: item
		});

		return $.ajax({
			url: '/v1/tasks'
			, type: 'post'
			, data: item
		})
		.then(
			item => dispatch({type: TASK_RECV_ITEM, item, tid})
			, err => dispatch({type: TASK_ERROR, err})
		);
	}
}

export function removeItem(item){
	return function(dispatch){
		dispatch({
			type: TASK_REMOVE_ITEM
			, item: item
		});

		return $.ajax({
			url: '/v1/task/' + item._id
			, type: 'delete'
		});
	}
}
