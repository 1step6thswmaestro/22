import Q from 'q';

export function getLocation(){
	return _getLocation()
	.fail(()=>{})
}

function _getLocation(){
	var defer = Q.defer();
	navigator.geolocation.getCurrentPosition(
		position=>defer.resolve({
			lat: position.coords.latitude
			, lon: position.coords.longitude
		})
		, err=>q.reject(err)
	)
	return defer.promise;
}