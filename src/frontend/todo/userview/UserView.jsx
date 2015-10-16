import React from 'react'
import MapImage from '../dialog/MapImage'
import LocationAddress from '../dialog/LocationAddress'
import LocSetup from './LocSetup'
import LocClusterView from './LocClusterView'

import _ from 'underscore'

class UserView extends React.Component{
	// Show about user info. It contains statistics, and info from user profiling.
	constructor(){
		super();
	}

	componentDidMount() {
	}

	render() {
		// TODO: show recent event log, that is recieved from server.
		return (
			<div className="user-view">
				<h3> 저장된 위치 정보 </h3>
				<div className='current-location'>
					<table>
						<tr>
							<td>현재 위치:</td>
							<td>
								{ this.props.location ? <LocationAddress location={this.props.location} /> : null }
							</td>
						</tr>
					</table>
				</div>
				<LocSetup location = {this.props.location}/>
				<LocClusterView />
				<h3> 이벤트 로그 </h3>
			</div>
		);
	}
};

export default UserView;
