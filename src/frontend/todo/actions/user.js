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

export function updateFeedly(){
	return function(dispatch, getState){
		dispatch({
			type: type.SET_FEEDLY_SYNC,
			loading: true
		});
		$.ajax({
			url: '/v1/feedly/update'
		})
		.then(function(){
			dispatch({
				type: type.SET_FEEDLY_SYNC,
				loading: false
			});
		})
	}
}