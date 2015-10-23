import React from 'react'
import If from '../utility/if'
import DateTimePicker from '../todo/dialog/DateTimePicker'
import { setGlobalTime } from '../todo/actions/global'
import { setConfig } from '../todo/actions/config'
import { fetchPrioritizedList } from '../todo/actions/tasks'


export default class DevelopView extends React.Component{
	setGlobalTime(time){
		const { dispatch } = this.props;
		var unixtime= time.valueOf();
		dispatch(setGlobalTime(unixtime));
		dispatch(fetchPrioritizedList());
	}

	toggleDatePicker(){
		const { dispatch } = this.props;
		dispatch(setConfig('globalTimePicker', !this.props.config.globalTimePicker));
	}

	render(){
		return (
			<div>
				<If test={this.props.config.globalTimePicker!=true}>
					<button className='btn btn-default' onClick={this.toggleDatePicker.bind(this)}>
						DatePicker 보이기
					</button>
				</If>
				<If test={this.props.config.globalTimePicker==true}>
					<div>
						<button className='btn btn-default' onClick={this.toggleDatePicker.bind(this)}>
							DatePicker 감추기
						</button>
						<DateTimePicker type='inline' onChange={this.setGlobalTime.bind(this)}/>
					</div>
				</If>
			</div>
		)
	}
}