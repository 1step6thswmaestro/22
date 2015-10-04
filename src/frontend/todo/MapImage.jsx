import React from 'react'

class MapImage extends React.Component{
	constructor(){
		super();
		this.state = {
		};
	}

	render() {
		var latlon = this.props.location.latitude + "," + this.props.location.longitude;
		var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=300x200&sensor=true";

		return (
			<div>
				{latlon}<br/>
				<img src={img_url} />
			</div>
		);
	}
};


export default MapImage;
