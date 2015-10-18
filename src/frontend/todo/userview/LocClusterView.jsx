import React from 'react'
import _ from 'underscore'

class LocClusterView extends React.Component{
	// With Google Maps show location clusters.
	// Location is extracted from event log.

	constructor(){
		super();
		this.state={
		}
	}

	componentDidMount() {
		var seoul = { lat: 37.547350, lng: 126.996725 };
		var map = new google.maps.Map(this.refs.map.getDOMNode(), {
			zoom: 12,
			center: seoul
		});

		// map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');
		map.data.loadGeoJson('v1/alllocations.json');

		// Color each letter gray. Change the color when the isColorful property
		// is set to true.
		map.data.setStyle(function(feature) {
			var color = 'gray';
			if (feature.getProperty('colorIdx')) {
				color = this.getColor(feature.getProperty('colorIdx'));
			}
			return /** @type {google.maps.Data.StyleOptions} */({
				fillColor: color,
				strokeColor: color,
				strokeWeight: 2
			});
		}.bind(this));

		$.getJSON('v1/keylocations.json', function( data ) {
			var items = [];
			$.each( data, function( key, val ) {
				// Convert data type from {type : "Point", coordinates: [37.531767, 126.913857]}
				// to { "coordinate": { "lat": 37.528901654859453, "lng": 126.97144059041139 } }
				var newVal = {
					coordinate: {
						lat: val.coordinates[0],
						lng: val.coordinates[1]
					}
				};

				var marker = new google.maps.Marker({
					position: newVal.coordinate,
					map: map
				});
			});
		});

		this.setState({
			map: map
		})

	}
	getColor(index){
	    if (index == 0)
	        return "rgb(0, 0, 255)";      //Blue
	    else if (index == 1)
	        return "rgb(255, 0, 0)";      //Red
	    else if (index == 2)
	        return "rgb(0, 255, 0)";      //Green
	    else if (index == 3)
	        return "rgb(255, 255, 0)";    //Yellow
	    else if (index == 4)
	        return "rgb(255, 0, 255)";    //Magenta
	    else if (index == 5)
	        return "rgb(255, 128, 128)";  //Pink
	    else if (index == 6)
	        return "rgb(128, 128, 128)";  //Gray
	    else if (index == 7)
	        return "rgb(128, 0, 0)";      //Brown
	    else if (index == 8)
	        return "rgb(255, 128, 0)";    //Orange
	    else
	        return "rgb(0, 0, 0)";      //Black
	}
	onButtonClick(){
		alert("Not Implemented yet.");
		console.log("Request event data process to server.");
	}

	render() {
		// I don't know how to dynamically adjust height. So right now, I give it
		// fixed height.
		var divStyle = {
			height: '500px',
			width: '100%'
		};
		return (
			<div class="clusterview" style={divStyle}>
				<button type="button" onClick={this.onButtonClick}> [DEV]Process Event Data</button>
				<div ref="map" id="map-canvas"  style={divStyle}>
				</div>
			</div>
		);
	}
};

export default LocClusterView;
