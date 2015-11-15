import React from 'react'
import MapImage from '../dialog/MapImage'
import LocationAddress from '../dialog/LocationAddress'

import _ from 'underscore'

class LocSetup extends React.Component{
	// Set user's frequently visit locations. i.e. home, school, work, etc.

	constructor(){
		super();
		this.state={
			locationstampHome: null,
			locationstampSchool: null,
			locationstampWork: null,
			locationstampEtc: null
		}

	}

	componentDidMount() {
		// Load User's saved locations from server
		$.getJSON('v1/locs', function( data ) {
			var items = [];
			// Convert data type from {type : "Point", coordinates: [37.531767, 126.913857]}
			// to { "latitude": 37.528901654859453, "longitude": 126.97144059041139  }

			for(let i = 0; i < 4; i++){
				if (data[i].coordinates.length == 2){
					items.push({
						latitude: data[i].coordinates[1],
						longitude: data[i].coordinates[0]
					});
				}
				else{
					items.push(null);
				}
			}

			console.log('recieved saved locations:', items);

			var locations={
				locationstampHome: items[0]
				, locationstampSchool: items[1]
				, locationstampWork: items[2]
				, locationstampEtc: items[3]
			};
			this.setState(locations);
		}.bind(this));
	}

	clickLocationClearButton(locLabel){
		var targetUrl = '/v1/locs/'+locLabel;
		console.log('Post Request to save location (url:', targetUrl);
		var coordinates = [];
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
		return (
			<div className='favorite-location-view'>
				<table className='location-table'>
				<tr>
					<th>위치</th>
					<th>주소</th>
				</tr>
				<tr>
					<td>집</td>
					<td>
						<div className='location-home'>
							{ this.state.locationstampHome ? <LocationAddress location={this.state.locationstampHome} /> : null }
							<button className="btn btn-warning" label="Discard this location" onClick={this.clickLocationClearButton.bind(this, 'home')}>
								<span className="glyphicon glyphicon-trash"></span> clear
							</button>
						</div>
					</td>
				</tr>
				<tr>
					<td>학교</td>
					<td>
						<div className='location-school'>
							{ this.state.locationstampSchool ? <LocationAddress location={this.state.locationstampSchool} /> : null }
							<button className="btn btn-warning" label="Discard this location" onClick={this.clickLocationClearButton.bind(this, 'school')}>
								<span className="glyphicon glyphicon-trash"></span> clear
							</button>
						</div>
					</td>
				</tr>
				<tr>
					<td>직장</td>
					<td>
						<div className='location-work'>
							{ this.state.locationstampWork ? <LocationAddress location={this.state.locationstampWork} /> : null }
							<button className="btn btn-warning" label="Discard this location" onClick={this.clickLocationClearButton.bind(this, 'work')}>
								<span className="glyphicon glyphicon-trash"></span> clear
							</button>
						</div>
					</td>
				</tr>
				<tr>
					<td>기타 지정장소</td>
					<td>
						<div className='location-etc'>
							{ this.state.locationstampEtc ? <LocationAddress location={this.state.locationstampEtc} /> : null }
							<button className="btn btn-warning" label="Discard this location" onClick={this.clickLocationClearButton.bind(this, 'etc')}>
								<span className="glyphicon glyphicon-trash"></span> clear
							</button>
						</div>
					</td>
				</tr>
				</table>
			</div>
		);
	}
};

export default LocSetup;
