import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('TASK_REQ_NEWITEM', (state, action)=>{
	let item = action.item;
	item.loading = true;

	let tempTasks = Object.assign(state.tempTasks, {[item.tid]: item});

	return Object.assign({}, state, {
		tempTasks
		, _list: state._list
		, _tlist: [...state._tlist, item.tid]
		, isFetching: true
	});
});

DECL('TASK_RECV_ITEM', (state, action)=>{
	let item = action.item;
	item.loading = false;
	let tasks = Object.assign(state.tasks, {[item._id]: item});
	let _list = state._list;
	if(_list.indexOf(item._id)<0){
		_list.push(item._id);
	}

	let _tlist = state._tlist;
	let tidIndex = _tlist.indexOf(action.tid);
	if(action.tid && tidIndex>=0){
		_tlist.splice(tidIndex, 1);
	}

	return Object.assign({}, state, {
		tasks
		, _list
		, _tlist
		, isFetching: false
	});
});

DECL('TASK_REQ_LIST', (state, action)=>{
	return Object.assign({}, state, {
		isFetching: true
	});
});

DECL('TASK_REQ_PLIST', (state, action)=>{
	return Object.assign({}, state, {
		isFetching: true
	});
});
DECL('TASK_REQ_ONGOING_LIST', (state, action)=>{
	return Object.assign({}, state, {
		isFetching: true
	});
});

DECL('TASK_RECV_LIST', (state, action)=>{
	let tasks = state.tasks;
	action.list.forEach(item=>{
		tasks[item._id] = item;
	});

	let _list = _.pluck(action.list, '_id');
	return Object.assign({}, state, {
		tasks
		, _list
		, isFetching: false
	});
});

DECL('TASK_RECV_LIST_PRIORITIZED', (state, action)=>{
	let tasks = state.tasks;
	action.list.forEach(item=>{
		tasks[item._id] = item;
	});
	let _plist = _.pluck(action.list, '_id');
	return Object.assign({}, state, {tasks, _plist})
});

DECL('TASK_ERROR', (state, action)=>{
	return Object.assign({}, state, {
		isFetching: false
	});
});

DECL('TASK_REMOVE_ITEM', (state, action)=>{
	let { taskId } = action;
	let { _list, _plist, tasks } = state;

	let listIndex = _list.indexOf(taskId);
	if(listIndex>=0){
		_list.splice(listIndex, 1);
	}


	let plistIndex = _plist.indexOf(taskId);
	if(plistIndex>=0){
		_plist.splice(plistIndex, 1);
	}

	delete tasks[taskId];
	
	return Object.assign({}, state, {
		tasks
		, _list
		, _plist
	});
})

DECL('TASK_REQ_UPDATE', (state, action)=>{
	let { tasks } = state;
	let { item } = action.item;
	item.loading = false;
	Object.assign(tasks, {[item._id]: item});

	return Object.assign({}, state, {tasks});
})

export const reducer = group.getReducer({
	isFetching: false
	, tasks: {}
	, _list: []
	, _plist: []
});
export const type = group.getTypes();
