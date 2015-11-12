import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('SET_EVENT_PROPERTY', (state, action)=>{
	let event = action.event;
	let list = state.list;
	let index = _.findIndex(list, {_id: event._id});
	if(index>=0){
		event[action.property] = action.value;
		list = [...list.slice(0, index), event, ...list.slice(index+1)];
	}

	console.log('setproperty', action, list);
	return Object.assign({}, state, {list});
})

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
