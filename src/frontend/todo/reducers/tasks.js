import * as ActionTypes from '../actions/tasks.js'
import _ from 'underscore'

const defaultState = ;

export default function taskReducer(state=defaultState, action){
	// console.log('reducer : ', action.type);
	switch(action.type){
		case ActionTypes.TASK_REQ_NEWITEM:
			
		case ActionTypes.TASK_UPDATE_ITEM:
		{
			
		}
		case ActionTypes.TASK_RECV_ITEM:
		{
			
		}


		case ActionTypes.TASK_REQ_LIST:
			
		case ActionTypes.TASK_RECV_LIST:
			
		case ActionTypes.TASK_RECV_LIST_PRIORITIZED:
			

		case ActionTypes.TASK_ERROR:
			
		case ActionTypes.TASK_REMOVE_ITEM:
		{
			
		}
		default:
			return state;
	}
}
