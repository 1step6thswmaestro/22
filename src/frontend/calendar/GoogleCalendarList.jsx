import React from 'react'
import If from '../utility/if'
import { fetchCalendarList, fetchCalendarSelection, selectCalendarItem } from '../todo/actions/thirdparty/google'
import _ from 'underscore'
import classNames from 'classnames';

// Just temporary code for oauth test.
class GoogleCalendarList extends React.Component{
	constructor(props){
		super(props);
		
		let { dispatch } = this.props;
		dispatch(fetchCalendarList());
		dispatch(fetchCalendarSelection());
	}

	selectCalendarItem(item){
		let { dispatch } = this.props;
		let selected = this.props.google.selectedCalendarItems[item.id];
		dispatch(selectCalendarItem(item, !selected));
	}

	render() {
		let google = this.props.google || {};
		let calendarList = google.calendarList || [];

		console.log('calendarList : ', calendarList);
		console.log('this.props.google.selectedCalendarItems : ', this.props.google.selectedCalendarItems);

		let items = calendarList.map(item => {
			let selected = this.props.google.selectedCalendarItems[item.id];
			return (
				<div className={classNames({listitem: true, selected: selected==true})} onClick={this.selectCalendarItem.bind(this, item)}>
					<If test={item.loading == true}>
						<i className='fa fa-spinner fa-spin mr10'></i>
					</If>
					{item.summary}
				</div>
			)
		});

		return (
			<div className="calendarlist-list">
				{items}
			</div>
		);
	}
};

export default GoogleCalendarList;
