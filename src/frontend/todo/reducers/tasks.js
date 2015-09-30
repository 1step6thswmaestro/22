import * as ActionTypes from '../actions/tasks.js'
import _ from 'underscore'

const defaultState = {
	isFetching: false
	, list: []
};

export default function taskReducer(state=defaultState, action){
	console.log('reducer : ', action.type);
	switch(action.type){
		case ActionTypes.TASK_REQ_NEWITEM:
			return Object.assign({}, state, {
				list: [...state.list, action.item]
			})
		case ActionTypes.TASK_RECV_ITEM:
			let list = state.list;
			let _item;
			if(action.tid){
				_item = _.findWhere(list, {tid: action.tid});
				console.log('tid : ', action.tid, _item);
				if(_item)
					_.extend(_item, action.item);
			}
			if(!_item){
				list = [...state.list, action.item];
			}
			return Object.assign({}, state, {list});

		case ActionTypes.TASK_REQ_LIST:
			return Object.assign({}, state, {
				loading: true
			});
		case ActionTypes.TASK_RECV_LIST:
			return Object.assign({}, state, {
				list: action.list
				, loading: false
			});
		case ActionTypes.TASK_ERROR:
			return Object.assign({}, state, {
				loading: false
			});
		case ActionTypes.TASK_REMOVE_ITEM:
			return Object.assign({}, state
				, state.list.map(function(item){
					if(item._id && item._id==action.item._id)item.removed = true;
					return item
				}));
		default:
			return state;
	}
}