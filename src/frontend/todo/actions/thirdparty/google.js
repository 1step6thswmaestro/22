'use strict'

import { type } from './google.decl';
import _ from 'underscore'

export function fetchCalendarList(){
	return function(dispatch, getState){
		$.ajax({
			url: '/v1/google/list'
		})
		.then(function(results){
			console.log(results);
			dispatch({
			type: type.GCAL_SET_CAL_LIST,
				list: results[0].items
			});
		})
	}
}

export function fetchCalendarSelection(){
	return function(dispatch, getState){
		$.ajax('/v1/google/calendarlist/selection')
		.then(function(results){
			console.log('selection', results);
			dispatch({
				type: type.GCAL_SET_CAL_SELECTION
				, selection: results
			})
		})
	}
}

export function selectCalendarItem(item, value){
	return function(dispatch, getState){
		dispatch({
			type: type.GCAL_CALENDARITEM_SET_LOADING
			, item
			, value: true
		})
		
		return $.ajax({
			url: `/v1/google/calendarlist/${value?'select':'unselect'}/${encodeURIComponent(item.id)}`
			, type: 'put'
		})
		.then(function(result){
			dispatch({
				type: type.GCAL_SELECT_CALENDARITEM
				, itemId: result.id
				, value: result.selected
			});
			dispatch({
				type: type.GCAL_CALENDARITEM_SET_LOADING
				, item
				, value: false
			})
		})
	}
}