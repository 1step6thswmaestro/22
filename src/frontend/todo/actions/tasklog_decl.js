import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('TASK_REQ_LOG', (state, action)=>{
	return Object.assign({}, state);
});

DECL('TASK_RECV_LOG', (state, action)=>{
	let newstate = Object.assign({}, state);
	if(state.item){
		newstate[action.taskId] = newstate[action.taskId] || [];
		newstate[action.taskId].push(state.item);
	}
	return newstate;
})

DECL('TASK_RECV_LOGS', (state, action)=>{
	let newstate = Object.assign({}, state);
	newstate[action.taskId] = action.list;
	return newstate;
})


DECL('TASK_LOG_ERROR', (state, action)=>{
	return Object.assign({}, state, {
	});
});

export const reducer = group.getReducer({});
export const type = group.getTypes();