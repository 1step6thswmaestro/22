'use strict'

import { type } from './user_decl';
import _ from 'underscore'

export function syncUserStatus(){
	return function(dispatch, getState){
		$.ajax({
			url: '/v1/user/status'
		})
		.then(function(status){
			dispatch({
				type: type.SET_USER_STATUS,
				status
			});
		})
	}
}