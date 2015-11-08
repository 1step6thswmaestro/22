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
				type: type.DUMP_USER_STATUS,
				status
			});
		})
	}
}

export function updateFeedly(){
	return function(dispatch, getState){
		dispatch({
			type: type.SET_USER_CONFIG,
			key: 'loading',
			value: true
		});
		$.ajax({
			url: '/v1/feedly/update'
		})
		.then(function(){
			dispatch({
				type: type.SET_USER_CONFIG,
				key: 'loading',
				value: false
			});
		})
	}
}

export function unauthFeedly(){
	return function(dispatch, getState){
		dispatch({
			type: type.SET_USER_CONFIG,
			key: 'unauthorizing',
			value: true
		});
		$.ajax({
			url: '/v1/feedly/unauth'
		})
		.then(()=>syncUserStatus()(dispatch, getState))
		.then(()=>{
			dispatch({
				type: type.SET_USER_CONFIG,
				key: 'unauthorizing',
				value: false
			});
		});
	}
}