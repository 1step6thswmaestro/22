import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('SET_USER_STATUS', (state, action)=>{
	return Object.assign({}, state, action.status);
});

export const reducer = group.getReducer({
	feedly: false
});
export const type = group.getTypes();