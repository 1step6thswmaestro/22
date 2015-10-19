import React from 'react'
import LocationAddress from '../dialog/LocationAddress'

import _ from 'underscore'

class LocAsk extends React.Component{
	// If location cluster is found, ask user what the place means.

	constructor(){
		super();
		this.state={
		};

	}

	componentDidMount() {
		$.getJSON('v1/keylocations.json', function( data ) {
			this.setState({
				// An array of GeoJSON geometry objects.
				loc_cluster: data
			});
		}.bind(this));
	}

	render() {
		console.log(this.state);

		function createQuestionElements(list){
			return _.map(list, function(val){
				var loc = {
					longitude: val.coordinates[1],
					latitude: val.coordinates[0]
				};

				return(
					<tr>
						<td>
							<LocationAddress location={loc} />
						</td>
						<td>
							mean:{val.avgtime.hour}:{val.avgtime.minute}, var:{val.variance}, 이 위치의 의미는?
						</td>
					</tr>
				);
			});
		}

		return (
			<div className='favorite-location-view'>
				<table>
				{createQuestionElements(this.state.loc_cluster)}
				</table>
			</div>
		);
	}
};

export default LocAsk;
