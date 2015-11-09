import _ from 'underscore'
import { getLocation } from '../../utility/location'


export class ActionGroup{
	constructor(){
		this.handlers = {};
	}

	_declare(action, callback){
		this.handlers[action] = callback;
	}

	declare(){
		return this._declare.bind(this);
	}

	getReducer(defaultState){
		var self = this;
		return (state=defaultState, action)=>{
			let reducer = this.handlers[action.type];
			if(reducer){
				return reducer(state, action);
			}
			else{
				return state;
			}
		}
	}

	getTypes(){
		return _.mapObject(this.handlers, (v,k)=>k);
	}
};

export function request(requestArg){
	return getLocation()
	.then(loc => {
		requestArg.data = requestArg.data || {};
		_.extend(requestArg.data, {loc: loc})
		return $.ajax(requestArg);
	})
}
