import React from 'react'
import moment from 'moment';

export default class TaskBanner extends React.Component{
	constructor(props){
		super(props);

		this.button_left = (
			<g transform="translate(-10.500000, -10.500000)">
				<circle stroke="#F96332" stroke-width="3" cx="10.5" cy="10.5" r="10.5" fill='none'></circle>
            	<path d="M12.793256,14.8235294 L6.17647059,10.5 L12.793256,6.17647059 L12.793256,14.8235294 Z" fill="#F96332"></path>
            </g>
		)

		this.btnRight = (
			<g transform="scale(-1.0, 1) translate(-10.500000, -10.500000)">
				<circle stroke="#F96332" stroke-width="3" cx="10.5" cy="10.5" r="10.5" fill='none'></circle>
            	<path d="M12.793256,14.8235294 L6.17647059,10.5 L12.793256,6.17647059 L12.793256,14.8235294 Z" fill="#F96332"></path>
            </g>
		)

		this.btnPlay = (
			<g>
	            <path d="M57.4951172,63 L20,38.5 L57.4951172,14 L57.4951172,63 Z" transform="translate(38.747559, 38.500000) scale(-1, 1) translate(-38.747559, -38.500000) "></path>
	        </g>
	    )
	}

	render(){
		console.log('this.props : ', this.props);
		let task = this.props.tasks.plist[0] || {name: 'unnamed'};

		let duedate = moment(task.duedate);

		return (
			<div className='task-banner'>
				<div className='content'>
					<div className='name'>
						{task.name}
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
				</div>
				<svg className='svg-left'>
					<g className='btn-arrow-left'>
						{this.button_left}
					</g>
				</svg>
				<svg className='svg-middle'>
					<g className='btn-play'>
						{this.btnPlay}
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