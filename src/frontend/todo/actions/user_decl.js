import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('DUMP_USER_STATUS', (state, action)=>{
	return Object.assign({}, state, action.status);
});

DECL('SET_USER_CONFIG', (state, action)=>{
	return Object.assign({}, state, {[action.key]: action.value})
})

export const reducer = group.getReducer({
});
export const type = group.getTypes();