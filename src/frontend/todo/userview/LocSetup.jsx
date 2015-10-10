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
		// Load User's favorite locations from server
		var locations;
		// TODO: LOAD FROM SERVER CODE HERE

		// PUT DUMMY DATA for now.
		locations={
			locationstampHome: {
				longitude: 126.9003409,
				latitude: 37.5392375
			}
			, locationstampSchool: {
				longitude: 126.952145,
				latitude: 37.449822
			}
			, locationstampWork: {
				longitude: 127.045323,
				latitude: 37.503720
			}
			, locationstampEtc: {
				longitude: 126.932801,
				latitude: 37.525809
			}
		};

		this.setState(locations);
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
						</div>
					</td>
				</tr>
				<tr>
					<td>학교</td>
					<td>
						<div className='location-school'>
							{ this.state.locationstampSchool ? <LocationAddress location={this.state.locationstampSchool} /> : null }
						</div>
					</td>
				</tr>
				<tr>
					<td>직장</td>
					<td>
						<div className='location-work'>
							{ this.state.locationstampWork ? <LocationAddress location={this.state.locationstampWork} /> : null }
						</div>
					</td>
				</tr>
				<tr>
					<td>기타 지정장소</td>
					<td>
						<div className='location-etc'>
							{ this.state.locationstampEtc ? <LocationAddress location={this.state.locationstampEtc} /> : null }
						</div>
					</td>
				</tr>
				</table>
			</div>
		);
	}
};

export default LocSetup;