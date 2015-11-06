'use strict'

import { type } from './timetable.decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'

export function fetchTimetable(){
	return (dispatch, getState) => {
		return $.ajax({
			url: '/v1/timetable/test'
			, type: 'put'
		})
		.then(
			result => {
				console.log(result);
				dispatch({type: type.FETCH_TIMETABLE, list: result});
			}
			, err => console.error(err)
		)
	}
}
