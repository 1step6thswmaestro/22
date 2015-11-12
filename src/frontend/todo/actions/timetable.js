'use strict'

import { type } from './timetable.decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'
import { request } from './common'
import { type as TaskActionType } from './tasks_decl';
import { type as TaskLogActionType } from './tasklog_decl';
import { type as ConfigType } from './config_decl'

export function fetchTimetable(){
	return (dispatch, getState) => {
		return $.ajax({
			url: '/v1/timetable/',
			type: 'get'
		})
		.then(
			result => {
				dispatch({type: type.FETCH_TIMETABLE, list: result});
				dispatch({
					type: ConfigType.SET_CONFIG
					, key: 'resetTaskModalState'
					, value: true
				});
			}
			, err => console.error(err)
		)
	}
}

export function resetTimetable(){
	return (dispatch, getState) => {
		return $.ajax({
			url: '/v1/timetable/make',
			type: 'put'
			, data:{
				time: getState().global.time
			}
		})
		.then(function(){
			return $.ajax({
				url: '/v1/timetable/',
				type: 'get'
			})}
		)
		.then(
			result => {
				dispatch({type: type.FETCH_TIMETABLE, list: result});
			}
			, err => console.error(err)
		)
	}
}


export function dismissTimetableItem(event, data, state){
	return (dispatch, getState) => {
		dispatch({
			type: type.SET_EVENT_PROPERTY
			, event: event
			, property: 'loading'
			, value: true
		})

		return request({
			url: `/v1/timetable/${event._id}/dismiss/${state?state:''}`
			, type: 'put'
			, data: data
		})
		.then(result=>{
			return fetchTimetable()(dispatch, getState)
			.then(function(){
				dispatch({type: TaskActionType.TASK_RECV_ITEM, item: result.task});
				dispatch({type: TaskLogActionType.TASK_RECV_LOG, item: result.log, taskId: result.task._id});

				dispatch({
					type: type.SET_EVENT_PROPERTY
					, event: event
					, property: 'loading'
					, value: false
				})
			})
		})
		.fail(()=>{
			dispatch({
				type: type.SET_EVENT_PROPERTY
				, event: event
				, property: 'loading'
				, value: false
			})
		})
	}
}

export function restoreTimetableItem(event, data, state){
	return (dispatch, getState) => {
		dispatch({
			type: type.SET_EVENT_PROPERTY
			, event: event
			, property: 'loading'
			, value: true
		})

		return request({
			url: `/v1/timetable/${event._id}/restore/${state?state:''}`
			, type: 'put'
			, data: data
		})
		.then(result=>{
			return fetchTimetable()(dispatch, getState)
			.then(function(){
				dispatch({type: TaskActionType.TASK_RECV_ITEM, item: result.task});
				dispatch({type: TaskLogActionType.TASK_RECV_LOG, item: result.log, taskId: result.task._id});

				dispatch({
					type: type.SET_EVENT_PROPERTY
					, event: event
					, property: 'loading'
					, value: false
				})
			})
		})
		.fail(()=>{
			dispatch({
				type: type.SET_EVENT_PROPERTY
				, event: event
				, property: 'loading'
				, value: false
			})
		})
	}
}

export function startItemDialog(event){
	return {
		type: type.TIMETABLE_SET_TOSTART
		, event
	}	
}
