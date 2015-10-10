import React from 'react'
import MapImage from './MapImage';

class LocationAddress extends React.Component{
	constructor(){
		super();
		this.state = {
			readableAddress: '',
			viewImage: 0,
		};
	}

	componentDidMount() {
		this.getAddress(function(data){
			var newVal = data.name2 + " " + data.name3;
			this.setState({
				readableAddress: newVal
			});
		}.bind(this));
	}

	getAddress(callback) {
		var api = "9ab8619b7f962dff68dd25b504f2a2d7";
		var coordSystem = "WGS84";
		var url = "https://apis.daum.net/local/geo/coord2addr?apikey=" + api + "&longitude=" + this.props.location.longitude + "&latitude=" + this.props.location.latitude + "&inputCoordSystem=" + coordSystem + "&output=json";
		var address = "Now loading...";
		var data;
		$.ajax({
			headers: {'Access-Control-Allow-Origin': '*'},
			dataType: "jsonp",
			url: url,
			data: data
		})
		.then(
			function(data){
				callback(data)
			}
			, function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		);
	}
	onAddressClick(){
		var newVal = this.state.viewImage ^ 1; // Toggle between 0 and 1
		this.setState({
			viewImage: newVal
		});

	}

	render() {
		return (
			<span className="location-address" onClick={this.onAddressClick.bind(this)}>{this.state.readableAddress}
				{ this.state.viewImage ? <MapImage location={this.props.location} /> : null }
			</span>
		);
	}
};

export default LocationAddress;
