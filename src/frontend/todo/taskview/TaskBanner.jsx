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
			<g transform="translate(-10.500000, -10.500000)" onClick={this.swipeLeft.bind(this)}>
				<circle stroke="#F96332" stroke-width="3" cx="10.5" cy="10.5" r="10.5" fill='#EBEBEB'></circle>
            	<path d="M12.793256,14.8235294 L6.17647059,10.5 L12.793256,6.17647059 L12.793256,14.8235294 Z" fill="#F96332"></path>
            </g>
		)

		this.btnRight = (
			<g transform="scale(-1.0, 1) translate(-10.500000, -10.500000)" onClick={this.swipeRight.bind(this)}>
				<circle stroke="#F96332" stroke-width="3" cx="10.5" cy="10.5" r="10.5" fill='#EBEBEB'></circle>
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

	render(){
		console.log('this.props : ', this.props);

		let x = 50;
		let widthOffset = [0.6, 0.225, 0.175];
		var width = 100;
		try{
			width = this.refs.svg.getDOMNode().offsetWidth-100;
		}
		catch(e){

		}
		widthOffset = widthOffset.map(offset=>offset*width);

		let contents = _.map(_.range(0, 3), offset=>{
			let index = (this.props.config.bannerIndex+offset)%this.props.tasks.plist.length;
			let task = this.props.tasks.plist[index] || {name: 'unnamed'};

			console.log(offset, index, task);

			let created = moment(task.created);
			let duedate = moment(task.duedate);

			let _x = x;
			x += widthOffset[offset];
			// style={{'clip-path' : `url(#cut-off-bottom${offset})`}}

			return (
				<foreignObject x={_x} y="0" width={widthOffset[offset]} height="150px">
					<div className={`content content${offset}`}>
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
				</foreignObject>
			)
		})

		return (
			<div className='task-banner'>
				<svg id='task-banner-canvas' ref='svg'>
					<defs>
					    <clipPath id="cut-off-bottom0">
					      <rect x="40" y="0" width="400px" height="150px" />
					    </clipPath>
					    <clipPath id="cut-off-bottom1">
					      <rect x="440" y="0" width="200px" height="150px" />
					    </clipPath>
					    <clipPath id="cut-off-bottom2">
					      <rect x="640" y="0" width="100px" height="150px" />
					    </clipPath>
					</defs>
					{contents}
				</svg>
				<svg className='svg-left'>
					<g className='btn-arrow-left'>
						{this.button_left}
					</g>
				</svg>
				
				<svg className='svg-right'>
					<g className='btn-arrow-right'>
						{this.btnRight}
					</g>
				</svg>
			</div>
		)
	}
}