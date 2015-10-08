import React from 'react'

class LocationAddress extends React.Component{
	constructor(){
		super();
		this.state = {
			readableAddress: ''
		};
	}

	componentDidMount() {
		this.getAddress(function(data){
			var newVal = data.name2 + " " + data.name3;
			console.log('On Success():' + newVal);

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

	render() {
		return (
			<div className="location-address">주소 : {this.state.readableAddress}</div>
		);
	}
};

export default LocationAddress;
