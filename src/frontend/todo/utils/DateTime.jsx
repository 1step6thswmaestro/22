// This is simple datetime picker.
// I don't know how to apply bootstrap datetime picker.
// So I decided to make one with only simple functions.
// Author: Insik Kim (insik92@gmail.com)
import React from "react"
var moment = require("moment");

class Picker extends React.Component{
	constructor(){
		super();
		this.state = {
			year: '2015',
			month: '03',
			day: '12',
			hour: '00',
			min: '00'
		}
	}
	getDate(){
		var date = moment({y: this.state.year, M: Number(this.state.month)-1, d: this.state.day, h: this.state.hour, m: this.state.min});
		return date;
	}

	onChange(name, evt){
		this.setState({
			[name]: evt.target.value
		}, function(){
			// Propage update news with updated this.state.
			this.props.onChange(this.getDate());
		});
	}

	onDone(){
		this.props.onChange(this.getDate()); // If user haven't touched picker, propagte default date.
		this.props.onFocusOut();
	}

	render(){
		return (
			<div className="picker">
				<input type="text" value={this.state.year} onChange={this.onChange.bind(this, "year")}/>
				<input type="text" value={this.state.month} onChange={this.onChange.bind(this, "month")}/>
				<input type="text" value={this.state.day} onChange={this.onChange.bind(this, "day")}/>
				<input type="text" value={this.state.hour} onChange={this.onChange.bind(this, "hour")}/>
				<input type="text" value={this.state.min} onChange={this.onChange.bind(this, "min")}/>
				<button type="button" onClick={this.onDone.bind(this)}>Done</button>
			</div>
		);
	}
}
class DateTime extends React.Component{
	constructor(){
		super();
		this.state = {
			value: '',
			showPicker: false
		}
	}
	onClick(){
		this.setState({ showPicker: true});
	}

	hidePicker(){
		this.setState({ showPicker: false});
	}

	update(v){
		this.setState({
			value: v
		});
	}

	makeReadable(dateVal){
		if(dateVal == ''){
			return '';
		}
		var readableDate = dateVal.format("YY/MM/DD HH:mm");
		return readableDate;
	}

	clear(){
		this.setState({
			value: ''
		});
	}

	render(){
		return (
			<div className="datetimepicker">
				<input type="text" value={this.makeReadable(this.state.value)} placeholder={this.props.placeholder} onClick={this.onClick.bind(this)}/>
				{ this.state.showPicker ? <Picker onChange={this.update.bind(this)} onFocusOut={this.hidePicker.bind(this)}/> : null }
			</div>
		);
	}
};

export default DateTime;
