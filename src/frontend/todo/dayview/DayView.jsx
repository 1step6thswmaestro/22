import React from 'react'

import { createStore } from 'redux'
import { connect } from 'react-redux';

import { handleAuthClick } from '../actions/oauth'

import _ from 'underscore'

class DayView extends React.Component{
	constructor(){
		super();
		this.state = {
			authorized: false
		};
	}

	handleAuth(event) {
		if (gapi._) {
			handleAuthClick(gapi, event);
		}
	}

	render() {
		return (
			<div classNmae="dayview">
				<div id="authorize-div">
					<span>Authorize access to Google Calendar API</span>
					<button id="authorize-button" onclick={this.handleAuth(event)}>
						Authorize
					</button>
				</div>
				<pre id="output"></pre>
			</div>
		);
	}
};

export default DayView;
