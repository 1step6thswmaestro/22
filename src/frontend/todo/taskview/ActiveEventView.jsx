import React from 'react';
import TaskStateType from '../../../constants/TaskStateType';
import _ from 'underscore';
import { dismissTimetableItem, restoreTimetableItem } from '../actions/timetable'
import If from '../../utility/if'


class ActiveEventView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ActiveEventView';
        this.state = {};
        this.state.cachedEvents = [];
    }

    componentWillUpdate(nextProps, nextState) {
        let needToShow = this.check(this.props, this.state, nextProps, nextState);     
        
        if(!this.state.needToShow && needToShow){
            this.resetCache();
        }
        this.addEventsToCache(nextProps.events);
        this.state.needToShow = needToShow;
    }

    addEventsToCache(events){
        console.log('addEventsToCache', events);
        _.each(events, event=>{
            let index = _.findIndex(this.state.cachedEvents, {_id: event._id});
            console.log(event, index);
            if(index>=0){
                this.state.cachedEvents.splice(index, 1, event);
            }
            else{
                this.state.cachedEvents.push(event);
            }
        })
    }

    resetCache(){
        this.state.cachedEvents = [];
    }

    check(prevProps, prevState, props, state){
    	if(props.events.length == 0)
            return false;

        let now = Math.floor(Date.now()/(30*60*1000));
        let endedEvents = _.filter(props.events, event=>{
            if(event.tableslotEnd < now){
                return true;
            }
            else{
                return false;
            }
        })

        if(endedEvents.length == 0)
            return false;

        console.log({endedEvents});

        return true;
    }

    dismiss(event){
        let { dispatch } = this.props;
        dispatch(dismissTimetableItem(event));
    }

    restore(event){
        let { dispatch } = this.props;
        dispatch(restoreTimetableItem(event));
    }

    renderItem(event){
        var hours = 0;
        var minutes = 0;
        var timeDifference = (new Date(event.tableslotStart*30*60*1000)).getTime()-Date.now();

        if(event){
            hours = Math.floor(timeDifference/1000/60/60);
            minutes = Math.floor(timeDifference/1000/60)%60;
        }

        return (
            <div className='mb10'>
                <div className="modal-header">
                    <If test={event.dismissed!=true}>
                        <h4 className="modal-title"><i className='fa fa-circoe-o'></i>{event.summary}</h4> 
                    </If>
                    <If test={event.dismissed==true}>
                        <div>
                            <h4 className='mr10 modal-title'><i className='fa fa-circoe-o'></i><strike>{event.summary}</strike></h4> 
                            <small className='word-wrap'>취소됨</small>
                        </div>
                    </If>
                </div>
                <If test={timeDifference>0}>
                    <div>
                        <small className='mr5'>남은 시간</small>
                        {(hours>0?`${hours}시간 `:'') + `${minutes}분`}
                    </div>
                </If>
                <div>
                    <div className='btn-group'>
                        <If test={event.dismissed!=true}>
                            <button className='btn btn-default' onClick={this.dismiss.bind(this, event)}>
                                취소
                            </button>
                        </If>
                        <If test={event.dismissed==true}>
                            <button className='btn btn-default' onClick={this.restore.bind(this, event)}>
                                복구
                            </button>
                        </If>
                    </div>
                </div>
            </div>
        )
    }

    render() {
    	let { events, tasks, global, config } = this.props;

        console.log('cachedEvents', this.state.cachedEvents);

		return (
			<div className="modal-contents">
				<div className="modal-header">
					<h4 className="modal-title">
						현재 진행중인 일정/할 일
					</h4>
				</div>
				<div className="modal-body">
					<div id='activeview-contents'>
						{_.map(this.state.cachedEvents, event=>this.renderItem(event))}
					</div>
				</div>
				<div className="modal-footer">
					<label className='mr10'>footer</label> 
				</div>
			</div>
		);
	}
}

export default ActiveEventView;
