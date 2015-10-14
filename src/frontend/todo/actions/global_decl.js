import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('GLOBAL_SET_TIME', (state, action)=>{
	return Object.assign(state, {time: action.time});
});

export const reducer = group.getReducer({
});
export const type = group.getTypes();