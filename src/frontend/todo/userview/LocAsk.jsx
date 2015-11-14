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
	clickLocationButton(locLabel, coordinates){
		var targetUrl = '/v1/locs/'+locLabel;
		console.log('Post Request to save location (url:', targetUrl);

		$.ajax({
			url: targetUrl
			, type: 'POST'
			, data:{
				type: 'Point',
				coordinates: coordinates
			}
		})
		.then(
			result => {}
			, err => {console.log(err);}
		)
	}



	render() {
		// console.log(this.state);

		function createQuestionElements(obj, list){
			// Create ask form for the locations in cluster.
			// console.log('cluster list:', list)
			return _.map(list, (function(val){
				// console.log('generate tags for:', val);
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
							mean:{val.avgtime.hour}:{val.avgtime.minute}, var:{val.variance}, 위치 정보 저장
							<div className="btn-group">
								<button className="btn btn-default" data-toggle="집" label="집" onClick={obj.clickLocationButton.bind(obj, 'home', val.coordinates)}>
									<span className="glyphicon glyphicon-home"></span>
								</button>
								<button className="btn btn-default" data-toggle="학교" label="학교" onClick={obj.clickLocationButton.bind(obj, 'school', val.coordinates)}>
									<span className="glyphicon glyphicon-book"></span>
								</button>
								<button className="btn btn-default" data-toggle="직장" label="직장" onClick={obj.clickLocationButton.bind(obj, 'work', val.coordinates)}>
									<span className="glyphicon glyphicon-briefcase"></span>
								</button>
								<button className="btn btn-default" data-toggle="기타" label="기타" onClick={obj.clickLocationButton.bind(obj, 'etc', val.coordinates)}>
									<span className="glyphicon glyphicon-flash"></span>
								</button>
							</div>
						</td>
					</tr>
				);
			}).bind(this));
		}

		return (
			<div className='favorite-location-view'>
				<table>
				{createQuestionElements(this, this.state.loc_cluster)}
				</table>
			</div>
		);
	}
};

export default LocAsk;
