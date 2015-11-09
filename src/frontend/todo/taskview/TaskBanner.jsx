import React from 'react'
import moment from 'moment';
import { setConfig } from '../actions/config'
import _ from 'underscore';
import If from '../../utility/if'
import TaskStateType from '../../../constants/TaskStateType';
import { pauseItem } from '../actions/tasks';
import { startItemDialog } from '../actions/timetable';



export default class TaskBanner extends React.Component{
	constructor(props){
		super(props);

		this.index = 0;

		this.button_left = (
			<g transform="translate(-10.500000, -10.500000)">
				<circle stroke="#F96332" strokeWidth="3" cx="10.5" cy="10.5" r="10.5" fill='#EBEBEB'></circle>
            	<path d="M12.793256,14.8235294 L6.17647059,10.5 L12.793256,6.17647059 L12.793256,14.8235294 Z" fill="#F96332"></path>
            </g>
		)

		this.btnRight = (
			<g transform="scale(-1.0, 1) translate(-10.500000, -10.500000)">
				<circle stroke="#F96332" strokeWidth="3" cx="10.5" cy="10.5" r="10.5" fill='#EBEBEB'></circle>
            	<path d="M12.793256,14.8235294 L6.17647059,10.5 L12.793256,6.17647059 L12.793256,14.8235294 Z" fill="#F96332"></path>
            </g>
		)

		this.btnPlay = (
			<g>
	            <path d="M57.4951172,63 L20,38.5 L57.4951172,14 L57.4951172,63 Z" transform="translate(38.747559, 38.500000) scale(-1, 1) translate(-38.747559, -38.500000) "></path>
	        </g>
	    )

	    this.btnPause = (
	    	<g>
	    		<rect x="22" y="10.8945312" width="10" height="54.2109375"></rect>
            	<rect x="44.5" y="10.8945312" width="10" height="54.2109375"></rect>
	    	</g>
	    )
	}


	start(task) {
		const { dispatch } = this.props;
		dispatch(startItemDialog(task));
	}

	pause(task) {
		const { dispatch } = this.props;
		dispatch(pauseItem(task));
	}


	swipeLeft(){
		let index = (this.props.config.bannerIndex-1)%this.props.timetable.list.length;
		this.props.dispatch(setConfig('bannerIndex', index));
	}

	swipeRight(){
		let index = (this.props.config.bannerIndex+1)%this.props.timetable.list.length;
		this.props.dispatch(setConfig('bannerIndex', index));
	}

	getEvent(offset){
		let index = (this.props.config.bannerIndex+offset+this.props.timetable.list.length)%this.props.timetable.list.length;
		let event = this.props.timetable.list[index] || {summary: '<no schedule>'};

		return event;
	}

	getTask(event){
		return this.props.tasks.tasks[event.taskId];
	}

	render(){
		let contents = ()=>{
			let offset = 0;
			let event = this.getEvent(offset);
			let task = this.getTask(event);

			let begin = moment(event.tableslotStart * (30*60*1000));
			let end = moment(event.tableslotEnd * (30*60*1000));

			return (
				<div className='content'>
					<div className='name'>
						{event.summary}
					</div>
					<If test={task!=null}>
						<div>
							<div className='duedate'>
								<i className='fa fa-clock-o'></i>
								<span className='date-label'>created</span>
								{task&&moment(task.created).format("YY/MM/DD, HH:mm")}
							</div>
							<div className='duedate'>
								<i className='fa fa-clock-o'></i>
								<span className='date-label'>due</span>
								{task&&moment(task.duedate).format("YY/MM/DD, HH:mm")}
							</div>
						</div>
					</If>
					<div className='duedate'>
						<i className='fa fa-clock-o'></i>
						<span className='date-label'>begin</span>
						{begin.format("YY/MM/DD, HH:mm")}
					</div>
					<div className='duedate'>
						<i className='fa fa-clock-o'></i>
						<span className='date-label'>end</span>
						{end.format("YY/MM/DD, HH:mm")}
					</div>
					<div className='buttons'>
						<div className="btn-group">
							<button className={"btn "} data-toggle="집" label="집">
								<span className="glyphicon glyphicon-home"></span>
							</button>
						</div>
					</div>
					<If test={offset==0}>
						<div>
							<If test={!task || task.state != TaskStateType.named.start.id}>
								<svg className='svg-middle' onClick={this.start.bind(this, task)}>
									<g className='btn-play'>
										{this.btnPlay}
									</g>
								</svg>
							</If>
							<If test={task && task.state == TaskStateType.named.start.id}>
								<svg className='svg-middle' onClick={this.pause.bind(this, task)}>
									<g className='btn-play'>
										{this.btnPause}
									</g>
								</svg>
							</If>
						</div>
					</If>
				</div>
			)
		}();

		let prevEvent = this.getEvent(-1);
		let nextEvent = this.getEvent(+1);

		return (
			<div className='task-banner'>
				<div className='content-wrapper'>
					{contents}
				</div>
				<div className='inner-canvas inner-canvas-left' onClick={this.swipeLeft.bind(this)}>
					<div className='inner-content'>
						<div className='name'>
							{prevEvent.summary}
						</div>
					</div>
					<svg>
						<g className='btn-arrow-left'>
							{this.button_left}
						</g>
					</svg>
				</div>
				<div className='inner-canvas inner-canvas-right' onClick={this.swipeRight.bind(this)}>
					<div className='inner-content'>
						<div className='name'>
							{nextEvent.summary}
						</div>
					</div>
					<svg>
						<g className='btn-arrow-right'>
							{this.btnRight}
						</g>
					</svg>
				</div>
			</div>
		)
	}
}