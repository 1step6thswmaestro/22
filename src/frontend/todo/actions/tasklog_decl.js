import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('TASK_REQ_LOG', (state, action)=>{
	return Object.assign({}, state);
});

DECL('TASK_RECV_LOG', (state, action)=>{
	let groupBy = state.groupBy || {};
	if(state.item){
		groupBy[action.taskId] = groupBy[action.taskId] || [];
		groupBy[action.taskId].push(action.item);
	}

	let list = state.list || {};
	list[action.item._id] = action.item;

	let newstate = Object.assign({}, state, {groupBy, list});
	return newstate;
})

DECL('TASK_RECV_LOGS', (state, action)=>{
	let groupBy = state.groupBy || {};
	groupBy[action.taskId] = action.list;

	let list = state.list || {};
	_.each(action.list, log=>list[log._id]=log);

	let newstate = Object.assign({}, state, {groupBy, list});
	return newstate;
})


DECL('TASK_LOG_ERROR', (state, action)=>{
	return Object.assign({}, state, {
	});
});

export const reducer = group.getReducer({
	groupBy: {}
	, list: {}
});
export const type = group.getTypes();