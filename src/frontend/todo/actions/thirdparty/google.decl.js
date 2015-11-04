import { ActionGroup } from '../common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('GCAL_SET_CAL_LIST', (state, action)=>{
	console.log({action});
	return Object.assign({}, state, {calendarList: action.list});
});

DECL('GCAL_SET_CAL_SELECTION', (state, action)=>{
	return Object.assign({}, state, {selectedCalendarItems: action.selection});
});

DECL('GCAL_SELECT_CALENDARITEM', (state, action)=>{
	let itemId = action.itemId || action.item.id;
	let selectedCalendarItems = Object.assign({}, state.selectedCalendarItems, {[itemId]: action.value});
	return Object.assign({}, state, {selectedCalendarItems});
});

DECL('GCAL_CALENDARITEM_SET_LOADING', (state, action)=>{
	let calendarList = state.calendarList;
	let index = _.findIndex(calendarList, {id: action.item.id});
	if(index>=0){
		calendarList = [...calendarList.slice(0, index), Object.assign({}, calendarList[index], {loading: action.value}), ...calendarList.slice(index+1)]
	}
	return Object.assign({}, state, {calendarList});
})

export const reducer = group.getReducer({
	calendarList: []
	, selectedCalendarItems: {}
});
export const type = group.getTypes();