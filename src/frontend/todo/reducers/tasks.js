import * as ActionTypes from '../actions/tasks.js'
import _ from 'underscore'

const defaultState = {
	isFetching: false
	, list: []
};

export default function taskReducer(state=defaultState, action){
	// console.log('reducer : ', action.type);
	switch(action.type){
		case ActionTypes.TASK_REQ_NEWITEM:
			return Object.assign({}, state, {
				list: [...state.list, action.item]
				, isFetching: true
			})
		case ActionTypes.TASK_UPDATE_ITEM:
		{
			let newlist = state.list.map(function(item){
				var _item = item;
				if(item._id == action.taskID){
					_.extend(_item, action.data);
				}
				return _item;
			});

			return Object.assign({}, state, {
				list: newlist
				, isFetching: true
			});
		}
		case ActionTypes.TASK_RECV_ITEM:
		{
			let newlist = state.list.map(function(item){
				var _item = item;
				if(action.tid && _item.tid == action.tid){
					_.extend(_item, action.item);
				}
				else if(action.taskID && _item._id == action.taskID){
					_.extend(_item, action.data);
				}
				return _item;
			});
			return Object.assign({}, state, {
				list: newlist
				, isFetching: false
			});
		}


		case ActionTypes.TASK_REQ_LIST:
			return Object.assign({}, state, {
				isFetching: true
			});
		case ActionTypes.TASK_RECV_LIST:
			return Object.assign({}, state, {
				list: action.list
				, isFetching: false
			});

		case ActionTypes.TASK_ERROR:
			return Object.assign({}, state, {
				isFetching: false
			});
		case ActionTypes.TASK_REMOVE_ITEM:
		{
			let newlist = state.list.filter(function(item){
				return item._id!=action.taskID;
			});

			return Object.assign({}, state, {
				list: newlist
				, isFetching: false
			});
		}
		default:
			return state;
	}
}
