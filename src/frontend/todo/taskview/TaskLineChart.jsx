'use strict'

import React from 'react'
import d3 from 'd3'
import rd3 from '../../d3'
import _ from 'underscore';
import classnames from 'classnames'
import If from '../../utility/if'

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
    		return;
	    }

    	let preferences = nextProps.tasks.preferences[nextProps.config.timePreferenceChartTaskId];
		if(!preferences){
			nextState.preferences = undefined;
			return;
		}


		preferences = [preferences[0], ...preferences[1]]
		nextState.preferences = preferences;
	}

	componentDidUpdate(prevProps, prevState) {
        if(this.props.config.timePreferenceChartTaskId != null){
        	if(this.state.preferences)
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

    renderTitle(index){
    	const { preferences } = this.state;
		if(!preferences || !preferences[index]){
			return 'no-token';
		}

		let preference = preferences[index];
		let text = preference.tokens.join?preference.tokens.join(', '):preference.tokens;
		return `[${this.state.index}] ${text}`
    }

    makeLineData(index){
    	const { preferences } = this.state;
    	if(!preferences)
    		return [];

    	let range;
    	if(index==0){
    		range = _.range(0, preferences.length);
    	}
    	else{
    		range = [index];
    	}


    	let lineData = _.map(range, i=>{
    		let preference = preferences[i];
			let values = _.map(preference.score, (v, i)=>{
				return {x: i, y: v};
			})

			return {
				name: this.renderTitle(i)
				, values
				, strokeWidth: i==0?"3":"1"
				, strokeDashArray: i==0?undefined:`${i*2},${i*2}`
			}
    	})

		return lineData;
    }

    renderContents(lineData){
		let xAxisTickValues = _.range(0, 7*48, 12);

		function formatter(i){
			i+=18;
			i=i%48;
			let val = Math.floor(i/2);
			return (val<10?'0':'') + val;
		}

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
				legend={lineData.length>0}
				sideOffset={130}
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
						        <button className='btn btn-default' onClick={this.nextToken.bind(this, -1)}><i className='fa fa-chevron-left'></i></button>
						        <button className='btn btn-default mr10' onClick={this.nextToken.bind(this, +1)}><i className='fa fa-chevron-right'></i></button>
                                
                                <h4 className="modal-title" id="gridSystemModalLabel">
                                    {this.renderTitle(this.state.index)} 
                                </h4>
                            </div>
							{this.renderContents(this.makeLineData(this.state.index))}
				        </div>
				    </div>
	        	</div>
	        </div>
		)
	}
}