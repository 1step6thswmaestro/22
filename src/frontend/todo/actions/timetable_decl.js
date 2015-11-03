import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('REQ_TIMETABLE', (state, action)=>{
	return Object.assign({}, state);
});

DECL('RECV_TIMETABLE', (state, action)=>{
	let timelist = state.timelist;

	return Object.assign({}, state, { timelist });
});


DECL('TIMETABLE_ERROR', (state, action)=>{
	return Object.assign({}, state, {
	});
});

export const reducer = group.getReducer({
});
export const type = group.getTypes();