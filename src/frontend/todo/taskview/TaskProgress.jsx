import React from 'react';
import _ from 'underscore';

export default class TaskProgress extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		if(this.props.count<=0){
			return <i></i>
		}

		let x = 0;
		let contents = _.map(_.range(this.props.count), i=>{
			let _x = x;
			x += 5 + 3;
			return (
				<rect x={_x} y={10} className='progress-elem'>
				</rect>
			)
		})

		let width = this.props.count * 5 + (this.props.count-1) * 3
		return (
			<svg width={width} className='task-progress'>
				{contents}
			</svg>
		);
	}
}