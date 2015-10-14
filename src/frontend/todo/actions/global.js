'use strict'

import { type } from './global_decl';
import _ from 'underscore'

export function setGlobalTime(time){
	return {
		type: type.GLOBAL_SET_TIME
		, time: time
	};
}