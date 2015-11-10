import React from 'react';
import TaskStateType from '../../../constants/TaskStateType';
import _ from 'underscore';
import { dismissTimetableItem, restoreTimetableItem } from '../actions/timetable'
import { uncompleteItem, completeItem } from '../actions/tasks'
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

        //취소된 것은 event만 남김. (not task)
        this.state.cachedEvents = _.filter(this.state.cachedEvents, event=>{
            let task = this.props.tasks.tasks[event.taskId];
            return !task || task.start == TaskStateType.named.start.id; 
        });

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
        let zipped = _.zip(prevProps.events, props.events);

        for(var i in zipped){
            if(zipped[i][0] == zipped[i][1])
                return false;
        }

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

    complete(event, task){
        let { dispatch } = this.props;
        dispatch(completeItem(task));
    }

    uncomplete(event, task){
        let { dispatch } = this.props;
        dispatch(uncompleteItem(task));
    }

    restore(event){
        let { dispatch } = this.props;
        dispatch(restoreTimetableItem(event));
    }

    renderItem(event, task){
        var hours = 0;
        var minutes = 0;
        var timeDifference = (new Date(event.tableslotStart*30*60*1000)).getTime()-Date.now();

        if(event){
            hours = Math.floor(timeDifference/1000/60/60);
            minutes = Math.floor(timeDifference/1000/60)%60;
        }

        let buttons = [];

        if(task && task.state == TaskStateType.named.complete.id){
            buttons.push((
                <button className='btn btn-checked' onClick={this.uncomplete.bind(this, event, task)}>
                    완료 취소
                </button>
            ));
        }
        else if(event){
            if(event.dismissed!=true){
                if(task){
                    buttons.push((
                        <button className='btn btn-default' onClick={this.complete.bind(this, event, task)}>
                            완료
                        </button>
                    ));
                    buttons.push((
                        <button className='btn btn-default' onClick={this.dismiss.bind(this, event, task)}>
                            일시정지
                        </button>
                    ))
                }
                else{
                    buttons.push((
                        <button className='btn btn-default' onClick={this.dismiss.bind(this, event, task)}>
                            취소
                        </button>
                    ))
                }
            }
            else{
                buttons.push((
                    <button className='btn btn-default' onClick={this.restore.bind(this, event, task)}>
                        재개
                    </button>
                ))
            }
        }

        let title;
        if(task && task.state == TaskStateType.named.complete.id){
            title = (
                <div>
                    <h4 className='mr10 modal-title'><i className='fa fa-circoe-o'></i><strike>{event.summary}</strike></h4> 
                    <small className='word-wrap'>완료됨</small>
                </div>
            )
        }
        else if(event.dismissed){
            title = (
                <div>
                    <h4 className='mr10 modal-title'><i className='fa fa-circoe-o'></i><strike>{event.summary}</strike></h4> 
                    <small className='word-wrap'>취소됨</small>
                </div>
            )
        }
        else{
            title = (
                <h4 className="modal-title"><i className='fa fa-circoe-o'></i>{event.summary}</h4> 
            )
        }

        return (
            <div className='mb10'>
                <div className="modal-header">
                    {title}
                </div>
                <If test={timeDifference>0}>
                    <div>
                        <small className='mr5'>남은 시간</small>
                        {(hours>0?`${hours}시간 `:'') + `${minutes}분`}
                    </div>
                </If>
                <div>
                    <div className='btn-group'>
                        {buttons}
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
					<h4 className="modal-title">현재 진행중인 일정/할 일</h4>
				</div>
				<div className="modal-body">
					<div id='activeview-contents'>
                        <If test={this.state.cachedEvents.length>0}>
                            <div>
                                {_.map(this.state.cachedEvents, event=>this.renderItem(event, this.props.tasks.tasks[event.taskId]))}
                                <div className="modal-header">
                                    <label className="modal-title"></label>
                                </div>
                                <div className="modal-body" style={{'text-align':'center'}}>
                                    다음 일을 하려면 먼저 현재 수행중인 일을 완료(혹은 취소)하세요.
                                </div>
                            </div>
                        </If>
                        <If test={this.state.cachedEvents.length==0}>
                            <div style={{'text-align':'center'}}>
                                현재 진행중인 작업이 없습니다.
                            </div>
                        </If>
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
