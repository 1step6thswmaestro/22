import React from 'react'

export default class DaySeperator extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		let momentTime = moment(this.props.time);

		return (
			<div className='day-seperator'>
				{momentTime.format('MMM DD ddd')}
			</div>
		)
	}
}