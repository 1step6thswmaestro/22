import React from 'react'
import If from '../../utility/if'

import { createStore } from 'redux'
import { connect } from 'react-redux';
import { setConfig } from '../actions/config'

import { setApi, handleAuthClick, checkAuth, isAuthed } from '../actions/oauth'

import _ from 'underscore'

class DayView extends React.Component{
	constructor(){
		super();
		this.state = {
			authView: false
		}
	}

	toggleDayView(){
		let newVal = !this.state.authView;
		this.setState({authView: newVal});
	}

	handleAuth() {
		this.toggleDayView();
		if(gapi._){
			setApi(gapi);
			if(!isAuthed()) {
				handleAuthClick(event);
			}
		}
	}

	render() {
		let authview = (
			<div id="authorize-div">
				<span>Authorize access to Google Calendar API</span>
				<button id="authorize-button">
					Authorize
				</button>
			</div>
		);

		return (
			<div className="dayview">
				<If test={this.state.authView!=true}>
					<button className="btn btn-default" onClick={this.handleAuth.bind(this)}>
						Authorize
					</button>
				</If>
				<If test={this.state.authView==true}>
					<div>
						{authview}
						<pre id="output"></pre>
					</div>
				</If>
			</div>
		);
	}
};

export default DayView;
