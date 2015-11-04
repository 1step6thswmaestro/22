import React from 'react'
import If from '../utility/if'
import { setGlobalTime } from '../todo/actions/global'
import { setConfig } from '../todo/actions/config'
import classNames from 'classnames';



export default class ConfigView extends React.Component{
	toggleCalendarList(){
		let { dispatch } = this.props;
		dispatch(setConfig('showCalendarList', !this.props.config.showCalendarList));
	}

	render(){
		return (
			<div>
				<If test={this.props.config.showCalendarList!=true}>
					<button className='btn btn-default' onClick={this.toggleCalendarList.bind(this)}>
						Show CalendarList
					</button>
				</If>
				<If test={this.props.config.showCalendarList==true}>
					<button className='btn btn-check' onClick={this.toggleCalendarList.bind(this)}>
						Hide CalendarList
					</button>
				</If>
				<i className='mr10'></i>
			</div>
		)
	}
}