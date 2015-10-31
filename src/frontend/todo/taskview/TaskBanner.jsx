import React from 'react'
import moment from 'moment';
import { setConfig } from '../actions/config'
import _ from 'underscore';
import If from '../../utility/if'

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
	}

	swipeLeft(){
		let index = (this.props.config.bannerIndex-1)%this.props.tasks.plist.length;
		this.props.dispatch(setConfig('bannerIndex', index));
	}

	swipeRight(){
		let index = (this.props.config.bannerIndex+1)%this.props.tasks.plist.length;
		this.props.dispatch(setConfig('bannerIndex', index));
	}

	getTask(offset){
		let index = (this.props.config.bannerIndex+offset+this.props.tasks.plist.length)%this.props.tasks.plist.length;
		let task = this.props.tasks.plist[index] || {name: 'unnamed'};

		return task;
	}

	render(){
		let contents = ()=>{
			let offset = 0;
			let task = this.getTask(offset);

			let created = moment(task.created);
			let duedate = moment(task.duedate);

			return (
				<div className='content'>
					<div className='name'>
						{task.name}
					</div>
					<div className='duedate'>
						<i className='fa fa-clock-o'></i> {created.format("YY/MM/DD, HH:mm")}
					</div>
					<div className='duedate'>
						<i className='fa fa-clock-o'></i> {duedate.format("YY/MM/DD, HH:mm")}
					</div>
					<div className='buttons'>
						<div className="btn-group">
							<button className={"btn "} data-toggle="집" label="집">
								<span className="glyphicon glyphicon-home"></span>
							</button>
						</div>
					</div>
					<If test={offset==0}>
						<svg className='svg-middle'>
							<g className='btn-play'>
								{this.btnPlay}
							</g>
						</svg>
					</If>
				</div>
			)
		}();

		let prevTask = this.getTask(-1);
		let nextTask = this.getTask(+1);

		return (
			<div className='task-banner'>
				<div className='content-wrapper'>
					{contents}
				</div>
				<div className='inner-canvas inner-canvas-left' onClick={this.swipeLeft.bind(this)}>
					<div className='inner-content'>
						<div className='name'>
							{prevTask.name}
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
							{nextTask.name}
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