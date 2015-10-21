import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

// TODO: Refactoring.
// What's the point of using 'isFetching' for every request?
// If one request is finished and other are waiting, 'isFetching' become false.
// Then incosistent comes. Some request is still waiting, but app's state
// shows fetching list is completed.

DECL('TASK_REQ_NEWITEM', (state, action)=>{
	let item = action.item;
	item.loading = true;
	return Object.assign({}, state, {
		list: [...state.list, item]
		, isFetching: true
	});
});

DECL('TASK_RECV_NEWITEM', (state, action)=>{
	// This function is called when new task is created.
	let newlist = state.list.map(function(item){
		if(action.tid && item.tid == action.tid
			|| item._id == action.item._id){
			item = Object.assign({}, action.item);
			item.loading = false;
		}
		return item;
	});

	return Object.assign({}, state, {
		list: newlist
		, isFetching: false
	});
});

DECL('TASK_RECV_UPDATED_ITEM', (state, action)=>{
	// This function is called when existing task state is changed, or failed the attempt.
	// For the failure case. It just reset loading flag for the task.
	var newOngoingList, newList;

	if (action.isPrevStateStarted){
		if(action.isStateUpdated){
			// It is in the ongoinglist. So move it to the list.
			if (state.list.length != 0){
				newList = state.list.slice();
				newList.push(action.item);
			}
			else{
				newList = [action.item];
			}


			newOngoingList = state.ongoinglist.filter(function(el){
				return el._id != action.item._id;
			});

		}
		else{
			// Just reset loading flag.
			newOngoingList = state.ongoinglist.map(function(item){
				if(item._id == action.item._id){
					item = Object.assign({}, action.item);
					item.loading = false;
				}
				return item;
			});
			newList = state.list.slice();
		}
	}
	else{
		if(action.isStateUpdated){
			// It is in the list. So move it to the ongoinglist.
			if (state.ongoinglist.length != 0){
				newOngoingList = state.ongoinglist.slice();
				newOngoingList.push(action.item);
			}
			else{
				newOngoingList = [action.item];
			}

			newList = state.list.filter(function(el){
				return el._id != action.item._id;
			});
		}
		else{
			// Just reset loading flag.
			newList = state.list.map(function(item){
				if(item._id == action.item._id){
					item = Object.assign({}, action.item);
					item.loading = false;
				}
				return item;
			});
			newOngoingList = state.ongoinglist.slice();
		}

	}

	return Object.assign({}, state, {
		list: newList,
		ongoinglist: newOngoingList,
		isFetching: false
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

DECL('TASK_RECV_ONGOING_LIST', (state, action)=>{
	return Object.assign({}, state, {
		ongoinglist: action.list
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

// Use to update both state and values of task.
DECL('TASK_REQ_UPDATE', (state, action)=>{
	let newlist = state.list.map(function(item){
		if(item._id == action.item._id){
			item = Object.assign({}, item);
			item.loading = true;
		}
		return item;
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
	, ongoinglist: []
});
export const type = group.getTypes();
