import React from 'react'
import If from '../utility/if'
import DateTimePicker from '../todo/dialog/DateTimePicker'
import { setGlobalTime } from '../todo/actions/global'
import { setConfig } from '../todo/actions/config'
import { fetchPrioritizedList } from '../todo/actions/tasks'
import classNames from 'classnames';



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
		let { dispatch, config } = this.props;
		let buttonRaw = [
			{text: 'default', command: undefined}
			, {text: 'time preference', command: 'time'}
		]

		let checkedObj;
		buttonRaw.forEach(obj=>{
			if(obj.command == this.props.config.priorityStrategy){
				obj.checked = true;
				checkedObj = obj;
			}
		});
		if(!checkedObj){
			buttonRaw[0].checked = true;
		}

		function setPriorityStrategyConfig(obj){
			dispatch(setConfig('priorityStrategy', obj.command));
			dispatch(fetchPrioritizedList());
		}


		let buttons = buttonRaw.map(obj=>{
			var btnClass = classNames({
		    	'btn': true,
		    	'btn-checked': obj.checked,
		    	'btn-default': !obj.checked
		    });
		    return (
		    	<button key={obj.text} className={btnClass} onClick={setPriorityStrategyConfig.bind(this, obj)}>
		    		{obj.text}
		    	</button>
		    )
		})

		function toggleDisplayActiveListOnly(){
			dispatch(setConfig('displayActiveListOnly', !config.displayActiveListOnly));
		}

		let onlyActiveButton = (
			<button className={classNames({'btn': true, 'btn-checked': config.displayActiveListOnly, 'btn-default': !config.displayActiveListOnly})} onClick={toggleDisplayActiveListOnly.bind(this)}>
				Display Active List Only
			</button>
		)

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
				<i className='mr10'></i>
				{buttons}
				<i className='mr10'></i>
				{onlyActiveButton}
			</div>
		)
	}
}