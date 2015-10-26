'use strict'

import { type } from './config_decl';
import _ from 'underscore'

export function setConfig(key, value){
	return {
		type: type.SET_CONFIG
		, key
		, value
	};
}