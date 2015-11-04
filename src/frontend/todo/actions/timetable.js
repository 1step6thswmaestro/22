'use strict'

import { type } from './timetable_decl';
import _ from 'underscore'

export function fetchTimetable(task){
	return (dispatch) => {
		dispatch({
			type: type.REQ_TIMETABLE
		});

		return $.ajax({
			url: '/v1/timetable',
			type: 'get'
		})
		.then(
			result => {
				dispatch({type: type.RECV_TIMETABLE, timelist: result.timelist});
			}
			, err => dispatch({type: type.TIMETABLE_ERROR, err})
		)
	}
}