import { ActionGroup } from './common.js'
import { reducer as TaskLogReducer } from './tasklog_decl.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('TASK_REQ_NEWITEM', (state, action)=>{
	return Object.assign({}, state, {
		list: [...state.list, action.item]
		, isFetching: true
	});
});

DECL('TASK_RECV_ITEM', (state, action)=>{
	console.log('TASK_RECV_ITEM', state, action);
	let newlist = state.list.map(function(item){
		if(action.tid && item.tid == action.tid){
			_.extend(item, action.item);
		}
		else if(item._id == action.item._id){
			_.extend(item, action.item);
		}
		return item;
	});
	return Object.assign({}, state, {
		list: newlist
		, isFetching: false
	});
});

DECL('TASK_REQ_LIST', (state, action)=>{
	return Object.assign({}, state, {
		isFetching: true
	});
});

DECL('TASK_RECV_LIST', (state, action)=>{
	return Object.assign({}, state, {
		list: action.list
		, isFetching: false
	});
});

DECL('TASK_RECV_LIST_PRIORITIZED', (state, action)=>{
	return Object.assign({}, state, {
		plist: action.list
	});
});

DECL('TASK_ERROR', (state, action)=>{
	return Object.assign({}, state, {
		isFetching: false
	});
});

DECL('TASK_REMOVE_ITEM', (state, action)=>{
	let newlist = state.list.filter(function(item){
		return item._id!=action.taskId;
	});

	return Object.assign({}, state, {
		list: newlist
		, isFetching: false
	});
})

export const reducer = group.getReducer({
	isFetching: false
	, list: []
	, plist: []
});
export const type = group.getTypes();