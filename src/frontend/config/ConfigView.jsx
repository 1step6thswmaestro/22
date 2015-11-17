import React from 'react'
import If from '../utility/if'
import { setGlobalTime } from '../todo/actions/global'
import { setConfig } from '../todo/actions/config'
import classNames from 'classnames';
import DateTimePicker from '../todo/dialog/DateTimePicker'
import moment from 'moment-timezone';
import { resetTimetable } from '../todo/actions/timetable'

export default class ConfigView extends React.Component{
	toggleCalendarList(){
		let { dispatch } = this.props;
		dispatch(setConfig('showCalendarList', !this.props.config.showCalendarList));
	}

	setGlobalTime(time){
		const { dispatch } = this.props;
		var unixtime= time.valueOf();
		var momentObj = moment(unixtime).tz('Asia/Seoul');

		dispatch(setGlobalTime(momentObj.toDate().getTime()));
		dispatch(fetchPrioritizedList());
	}

	toggleDatePicker(){
		const { dispatch } = this.props;
		dispatch(setConfig('globalTimePicker', !this.props.config.globalTimePicker));
	}

	toggleUserView(){
		const { dispatch } = this.props;
		dispatch(setConfig('userview', !this.props.config.userview));
	}

	renderTableButton(){
		let { dispatch, config } = this.props;

		let buttonRaw = [
			{text: 'Schedule', fa: 'fa-calendar', command: true}
			, {text: 'Tasks', fa: 'fa-list', command: false}
		]

		let checkedObj;
		buttonRaw.forEach(obj=>{
			if(obj.command == this.props.config.showEvent){
				obj.checked = true;
				checkedObj = obj;
			}
		});
		if(!checkedObj){
			buttonRaw[0].checked = true;
		}

		function set(obj){
			dispatch(setConfig('showEvent', obj.command));
		}

		return buttonRaw.map(obj=>{
			var btnClass = classNames({
		    	'btn': true,
		    	'btn-checked': obj.checked,
		    	'btn-default': !obj.checked
		    });
		    return (
		    	<button key={obj.text} className={btnClass} onClick={set.bind(this, obj)}>
		    		{obj.fa!=undefined?<i className={'mr5 fa ' + obj.fa}></i>:undefined}
		    		{obj.text}
		    	</button>
		    )
		})
	}

	showNextTaskModal(){
		let { dispatch } = this.props;
		dispatch(setConfig('forceShowTaskModal', true));
	}

	render(){
		return (
			<div>
				<div>
					<button className={classNames({'btn': true, 'btn-default': !this.props.config.userview, 'btn-checked': this.props.config.userview})} 
						onClick={this.toggleUserView.bind(this)}>
						<i className='fa fa-map-marker mr10'></i>{this.props.predictLocation}
					</button>
					<i className='mr10'></i>
					<If test={this.props.config.showCalendarList!=true}>
						<button className='btn btn-default' onClick={this.toggleCalendarList.bind(this)}>
							<i className='fa fa-google mr5'></i>GCal
						</button>
					</If>
					<If test={this.props.config.showCalendarList==true}>
						<button className='btn btn-check' onClick={this.toggleCalendarList.bind(this)}>
							<i className='fa fa-google mr5'></i>GCal
						</button>
					</If>
					<i className='mr10'></i>
					<If test={this.props.config.globalTimePicker!=true}>
						<button className='btn btn-default' onClick={this.toggleDatePicker.bind(this)}>
							<i className='fa fa-clock-o mr5'></i>DatePicker
						</button>
					</If>
					<If test={this.props.config.globalTimePicker==true}>
						<button className='btn btn-check' onClick={this.toggleDatePicker.bind(this)}>
							<i className='fa fa-clock-o mr5'></i>DatePicker
						</button>
					</If>
					<i className='mr10'></i>
					<div className='btn-group'>
						{this.renderTableButton()}
					</div>
					<i className='mr10'></i>
					<button className='btn btn-default' onClick={this.showNextTaskModal.bind(this)}>
						<i className='fa fa-bell-o mr5'></i>Notification
					</button>
					<i className='mr10'></i>
				</div>
				<If test={this.props.config.globalTimePicker==true}>
					<div>
						<DateTimePicker type='inline' onChange={this.setGlobalTime.bind(this)}/>
					</div>
				</If>
			</div>
		)
	}
}