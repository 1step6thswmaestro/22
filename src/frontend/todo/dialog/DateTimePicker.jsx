import React from "react"
import moment from "moment"
import If from "../../utility/if"

class DateTimePicker extends React.Component{
	constructor(props){
		super(props);
	}

	getEl(){
		return $(this.refs.datetimepicker.getDOMNode());
	}

	getData(){
		return this.getEl().data("DateTimePicker");
	}

	componentDidMount() {
		var opt;

		if(this.props.type=='inline'){
			opt = {
				inline: true,
                sideBySide: true
			}
		}
	    this.getEl().datetimepicker(opt);

	    this.init();

	    if(this.props.onChange){
		    this.getEl().on("dp.change", e=>this.props.onChange(e.date));
	    }
	}

	init(){
		this.setDate(this.props.default);
	}

	setDate(date){
		this.getData().date(new Date(date || Date.now()));
	}
	
	getValue(){
		return this.getData().date().valueOf();
	}

	getDate(){
		return new Date(this.getValue());
	}

	clear(){
		this.init();
	}

	getDefaultView(){
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

	getInlineView(){
		return (
			<div ref='datetimepicker'></div>
		)
	}

	render(){
		return (
			<div>
				<If test={!this.props.type || this.props.type=='default'}>
					{this.getDefaultView()}
				</If>
				<If test={this.props.type == 'inline'}>
					{this.getInlineView()}
				</If>
			</div>
		)
	}
}

export default DateTimePicker;