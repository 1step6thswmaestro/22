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

		// Add data
		console.log('Load my Point of Interest');

		// map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');
		map.data.loadGeoJson('v1/locations.json');

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
