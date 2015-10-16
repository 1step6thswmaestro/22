'use strict'

import Q from 'q';

export function getLocation(){
	return _getLocation()
	.fail(()=>{return {lat: 0, lon: 0}})
}

function _getLocation(){
	var defer = Q.defer();
	navigator.geolocation.getCurrentPosition(
		position=>defer.resolve({
			lat: position.coords.latitude
			, lon: position.coords.longitude
		})
		, err=>defer.reject(err)
	)
	return defer.promise.timeout(5000);
}
