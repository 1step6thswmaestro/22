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