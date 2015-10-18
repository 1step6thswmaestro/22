import React from 'react'
import LocationAddress from '../dialog/LocationAddress'
import LocSetup from './LocSetup'
import LocAsk from './LocAsk'
import LocClusterView from './LocClusterView'

import { getReadableDate } from '../../utility/date'

import _ from 'underscore'

class UserView extends React.Component{
	// Show about user info. It contains statistics, and info from user profiling.
	constructor(){
		super();
		this.state={
			connectionLogs: ''
		};
	}

	componentDidMount() {
		$.getJSON('v1/connections', function( data ) {
			// Save only last 10 items.
			this.setState({
				connectionLogs: data.slice(data.length-10, data.length)
			});
		}.bind(this));
	}

	render() {
		// TODO: show recent event log, that is recieved from server.

		function createConnectionLogsElements(list){
			return _.map(list, function(val){
				var loc = {
					latitude: val.loc.coordinates[0],
					longitude: val.loc.coordinates[1]
				};
				return(
					<div key={val.time}>
						<LocationAddress location={loc} />,
						{getReadableDate(val.time)}
					</div>
				);
			});
		}

		return (
			<div className="user-view">
				<h3> 새로 생긴 위치 클러스터 </h3>
				<LocAsk />
				<h3> 저장된 위치 정보 </h3>

				<LocSetup location = {this.props.location}/>
				<LocClusterView />


				<h3> 최근 10개 연결 로그 </h3>
				<div className='connection-log-container'>
					{createConnectionLogsElements(this.state.connectionLogs)}
				</div>


			</div>
		);
	}
};

export default UserView;
