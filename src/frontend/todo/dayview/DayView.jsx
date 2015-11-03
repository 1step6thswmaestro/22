import React from 'react';
import If from '../../utility/if';

import { createStore } from 'redux';
import { connect } from 'react-redux';

import { fetchTimetable } from '../actions/timetable.js';

import _ from 'underscore'

class DayView extends React.Component{
	constructor(){
		super();
		this.state = {

		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchTimetable());
	}

	render() {
		let timetableList;

		return (
			<div className="dayview">
			
			</div>
		);
	}
};

export default DayView;
