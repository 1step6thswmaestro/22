import React from 'react'
import MapImage from '../dialog/MapImage'

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
				<div className='location-home'>
					Home Location:
					{ this.state.locationstampHome ? <MapImage location={this.state.locationstampHome} /> : null }
				</div>
				<div className='location-school'>
					School Location:
					{ this.state.locationstampSchool ? <MapImage location={this.state.locationstampSchool} /> : null }
				</div>
				<div className='location-work'>
					Work Location:
					{ this.state.locationstampWork ? <MapImage location={this.state.locationstampWork} /> : null }
				</div>
				<div className='location-etc'>
					Etc Location:
					{ this.state.locationstampEtc ? <MapImage location={this.state.locationstampEtc} /> : null }
				</div>

			</div>
		);
	}
};

export default LocSetup;
