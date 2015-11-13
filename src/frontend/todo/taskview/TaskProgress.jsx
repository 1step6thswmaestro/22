import React from 'react';
import _ from 'underscore';

export default class TaskProgress extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		let count = this.props.count;
		count = Math.ceil(count);

		if(count<=0){
			return <i></i>
		}

		let x = 0;
		let contents = _.map(_.range(count), i=>{
			let _x = x;
			x += 5 + 3;
			return (
				<rect x={_x} y={10} className='progress-elem'>
				</rect>
			)
		})

		let width = count * 5 + (count-1) * 3
		return (
			<svg width={width} className='task-progress'>
				{contents}
			</svg>
		);
	}
}