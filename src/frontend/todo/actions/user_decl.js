import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('SET_USER_STATUS', (state, action)=>{
	return Object.assign({}, state, action.status);
});

DECL('SET_FEEDLY_SYNC', (state, action)=>{
	return Object.assign({}, state, {feedlyLoading: action.loading})
})

export const reducer = group.getReducer({
});
export const type = group.getTypes();