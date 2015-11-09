import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('FETCH_TIMETABLE', (state, action)=>{
	let list = action.list;

	return Object.assign({}, state, {list});
});

DECL('TIMETABLE_SET_TOSTART', (state, action)=>{
	return Object.assign({}, state, {toStartEvent: action.event})
})


export const reducer = group.getReducer({
	list: []
});
export const type = group.getTypes();
