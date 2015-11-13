import moment from 'moment';

// Convert time format from DB (Unix Time), to readable format.
export function getReadableDate(unixTimestamp){
	let readableData = '';
	if(typeof unixTimestamp != 'undefined'){
		if (unixTimestamp == null){
			readableData = '미지정';
		}
		else{
			readableData = moment(unixTimestamp).format("YY/MM/DD HH:mm");
		}
	}
	else{
		readableData = '오류: 정의 안됨';
	}
	return readableData;
}

export function tokenToReadableTime(token){
	var hours = Math.floor(token/2);
    var minutes = token%2 * 30;
	return getStringHourFromHourMinutes(hours, minutes);
}

export function getStringHourMinutes(miliseconds){
	if(miliseconds===undefined){
		return '-';
	}
	let seconds = miliseconds/1000;
	let minutes = seconds/60;
	return getStringHourFromHourMinutes(minutes/60, minutes%60)
}

export function getStringFromHours(_hours){
	let hours = Math.floor(_hours);
	let minutes = (Math.ceil(_hours)-_hours)*60;
	return getStringHourFromHourMinutes(hours, minutes);
}

export function getStringHourFromHourMinutes(hours, minutes){
	hours = Math.floor(hours);
	minutes = Math.floor(minutes);
	return (hours>0?`${hours}시간 `:'') + `${minutes}분`;
}