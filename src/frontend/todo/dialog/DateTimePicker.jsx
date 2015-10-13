import React from "react"
import moment from "moment"

class DateTimePicker extends React.Component{
	constructor(props){
		super(props);

		console.log(this.props);

		this.state = {
			default: this.props.default || Date.now()
		}
	}

	getEl(){
		return $(this.refs.datetimepicker.getDOMNode());
	}

	getData(){
		return this.getEl().data("DateTimePicker");
	}

	componentDidMount() {
	    this.getEl().datetimepicker();
	    this.init();
	}

	init(){
		this.getData().date(new Date(this.state.default));
	}
	
	getValue(){
		return this.getData().date().valueOf();
	}

	getDate(){
		return new Date(this.getValue());
	}

	clear(){
		this.state.default = this.props.default || Date.now();
		this.init();
	}

	render(){
		return (
			<div class="form-group">
				<label>{this.props.label}</label>
			 	<div className='input-group date' ref='datetimepicker'>
					<input type='text' className="form-control" />
					<span className="input-group-addon">
						<span className="glyphicon glyphicon-calendar"></span>
					</span>
                </div>
            </div>
		);
	}
}

export default DateTimePicker;