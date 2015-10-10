import React from 'react'
import MapImage from '../dialog/MapImage'
import LocSetup from './LocSetup'

import _ from 'underscore'

class UserView extends React.Component{
	// Show about user info. It contains statistics, and info from user profiling.
	constructor(){
		super();
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="user-view">
				<div className='current-location'>
					Current Location:
					{ this.props.location ? <MapImage location={this.props.location} /> : null }
				</div>
				<LocSetup location = {this.props.location}/>
			</div>
		);
	}
};

export default UserView;
