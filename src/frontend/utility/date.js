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
	return (hours>0?`${hours}시간 `:'') + `${minutes}분`;
}