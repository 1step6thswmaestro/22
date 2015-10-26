import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('SET_CONFIG', (state, action)=>{
	console.log(action);
	return Object.assign(state, {[action.key]: action.value});
});

export const reducer = group.getReducer({
	bannerIndex: 0
});
export const type = group.getTypes();