'use strict'

import { type } from './events.decl';
import { getLocation } from '../../utility/location'
import _ from 'underscore'

export function fetchList(){
	return (dispatch, getState) => {
		return $.ajax({
			url: '/v1/google/events/'
			, type: 'put'
		})
		.then(
			result => {
				console.log(result);
				dispatch({type: type.FETCH_EVENT_LIST, list: result});
			}
			, err => console.error(err)
		)
	}
}