'use strict'

import React from 'react'
import d3 from 'd3'
import rd3 from '../../d3'
import _ from 'underscore';
import classnames from 'classnames'

var BarChart = rd3.BarChart;
var LineChart = rd3.LineChart;

export default class TaskLineChart extends React.Component{
	constructor(props){
		super(props);
		this.state = {index: 0}
	}

	componentWillUpdate(nextProps, nextState) {
	    if(!nextProps.config.timePreferenceChartTaskId || !nextProps.tasks.preferences){
	    	nextState.preferences = undefined;
    		nextState.preference = undefined;
    		return;
	    }

    	let preferences = nextProps.tasks.preferences[nextProps.config.timePreferenceChartTaskId];
		if(!preferences){
			nextState.preferences = undefined;
			nextState.preference = undefined;
			return;
		}


		preferences = [preferences[0], ...preferences[1]]
		nextState.preferences = preferences;
		let preference = preferences[nextState.index];
		nextState.preference = preference;  
	}

	componentDidUpdate(prevProps, prevState) {
        if(this.props.config.timePreferenceChartTaskId != null){
        	if(this.state.preference)
        		this.show();
        }
    }

    show(){
    	let self = this;
    	var modal = $(React.findDOMNode(this));
        modal.modal({
            backdrop: true
            , keyboard: true
            , show: true
        }).on('hidden.bs.modal', function (e) {
        	self.props.config.timePreferenceChartTaskId  = undefined;
        })
    }

    renderTitle(){
    	const { preference } = this.state;
		if(!preference){
			return 'no-token';
		}

		let text = preference.tokens.join?preference.tokens.join(', '):preference.tokens;
		return `[${this.state.index}] ${text}`
    }

    renderContents(){
    	const { preference } = this.state;
    	if(!preference)
    		return;

		let values = _.map(preference.score, (v, i)=>{
			return {x: i, y: v};
		})

		let xAxisTickValues = _.range(0, 7*48, 12);

		function formatter(i){
			i+=18;
			i=i%48;
			let val = Math.floor(i/2);
			return (val<10?'0':'') + val;
		}

		var lineData = [
			{ 
				name: 'series1',
				values: values,
				// strokeWidth: 3,
				// strokeDashArray: "5,5",
				},
			// {
			// 	name: 'series2',
			// 	values : [ { x: 0, y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 } ]
			// },
			// {
			// 	name: 'series3',
			// 	values: [ { x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 2 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 2 } ]
			// } 
		];

		return (
			<LineChart
				data={lineData}
				width='100%'
				height={400}
				viewBoxObject={{
					x: 0,
					y: 0,
					width: 1000,
					height: 400
				}}
				title="Line Chart"
				yAxisLabel="Preference"
				xAxisLabel="Time"
				xAxisTickValues={xAxisTickValues}
				xAxisFormatter={formatter}
				gridHorizontal={true}
				circleRadius={0}
            />
		)
    }

    nextToken(offset){
    	let index = (this.state.index+offset)%(this.state.preferences||[]).length;
    	this.setState({index});
    }

	render(){
		return (
			<div className="modal" tabIndex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
				<div className="modal-dialog" role="document" style={{width: 'auto'}}>
					<div className="modal-content time-preference-score">
                        <div className="modal-contents form-group-attached">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="gridSystemModalLabel">
                                    {this.renderTitle()}
                                </h4>
                            </div>
							{this.renderContents()}
				        </div>
				        <button className='btn btn-default' onClick={this.nextToken.bind(this, -1)}>prev</button>
				        <button className='btn btn-default' onClick={this.nextToken.bind(this, +1)}>next</button>
				    </div>
	        	</div>
	        </div>
		)
	}
}