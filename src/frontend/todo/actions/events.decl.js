import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('FETCH_EVENT_LIST', (state, action)=>{
	let list = action.list;

	return Object.assign({}, state, {list});
});


export const reducer = group.getReducer({
	list: []
});
export const type = group.getTypes();
