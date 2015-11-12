import React from 'react';
import TaskStateType from '../../../constants/TaskStateType';
import classnames from 'classnames';
import { pauseItem, completeItem, uncompleteItem, removeItem, getRemainTime } from '../actions/tasks';
import { dismissTimetableItem } from '../actions/timetable'
import { setConfig } from '../actions/config'
import If from '../../utility/if'
import _ from 'underscore';
import { getStringHourMinutes } from '../../utility/date'

class TaskActionView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TaskActionView';
        this.state = {}
    }

    componentWillUpdate(nextProps, nextState) {
        this.state.needToShow = this.check(this.props, this.state, nextProps, nextState);
    }

    check(prevProps, prevState, props, state){
        let zipped = _.zip(prevProps.events, props.events);

        if(!props.config.resetTaskModalState){
            for(var i in zipped){
                if(zipped[i][0] == zipped[i][1])
                    return false;
            }
        }

        if(props.events.length <= 0){
            return false
        }

        return true;
    }

    complete(event, task){
        const { dispatch } = this.props;
        dispatch(completeItem(task));
    }

    uncomplete(event, task){
        let { dispatch } = this.props;
        dispatch(uncompleteItem(task));
    }

    start(event, task) {
        const { dispatch } = this.props;
        dispatch(dismissTimetableItem(event, 'restore', 'start'));
    }

    startOnSchedule(event, task){
        const { dispatch } = this.props;
        dispatch(dismissTimetableItem(event, 'restore', 'start', {time: event.tableslotStart*(30*60*1000)}));
    }

    pause(event, task) {
        const { dispatch } = this.props;
        dispatch(pauseItem(task));
    }

    discard(event, task){
        const { dispatch } = this.props;
        dispatch(removeItem(task));
    }

    postpone(event, task, hours){
        const { dispatch } = this.props;
        dispatch(dismissTimetableItem(event, 'dismiss', 'postpone', {scheduleId: event._id, hours}));
    }

    showPostponeOptions(event, task){
        const { dispatch } = this.props;
        if(task){
            this.setState(Object.assign({}, this.statte, {
               showPostponeOptions: true
               ,  showPostponeOptionsTargetTaskId: task._id
            }))
        }
    }


    renderItem(event, task) {
    	let { global, config } = this.props;

    	var hours = 0;
    	var minutes = 0;
        let now = global.time || Date.now();

        let begin = 0;

    	if(event){
            begin = event.tableslotStart*(30*60*1000);
	    	var timeDifference = now - begin;
	    	hours = Math.floor(timeDifference/1000/60/60);
	    	minutes = Math.floor(timeDifference/1000/60)%60;
    	}

    	var length_hours = 0;
    	var length_minuts = 0;

    	if(event){
    		if(task){
    			length_hours = task.estimation;
    		}
    		else{
    			let slots = (event.tableslotEnd-event.tableslotStart);
    			length_hours = Math.floor(slots/2);
    			length_minuts = slots%2 * 30;
    		}
    	}

        let actionButtons = [];
        if(task){
            if(task.state != TaskStateType.named.complete.id){
                if(task.state != TaskStateType.named.start.id){
                    actionButtons.push((
                        <button className='btn btn-default' onClick={this.start.bind(this, event, task)}>
                            지금 시작
                        </button>
                    ));
                    if(begin < now){
                        actionButtons.push((
                            <button className='btn btn-default' onClick={this.startOnSchedule.bind(this, event, task)}>
                                예정대로
                                ({(hours>0?`${hours}시간 `:'') + `${minutes}분 전`})
                            </button>
                        ));
                    }
                    if(this.state.showPostponeOptions && task && this.state.showPostponeOptionsTargetTaskId==task._id){
                        actionButtons.push((
                            <button className="btn btn-default disabled" label="Remind me later" onClick={this.showPostponeOptions.bind(this, event, task)}>
                                    <span className="glyphicon glyphicon-send"></span>
                            </button>
                        ))

                        actionButtons.push((
                            <button className="btn btn-warning" onClick={this.postpone.bind(this, event, task, 1)}>
                                1시간
                            </button>
                        ))
                        actionButtons.push((
                            <button className="btn btn-warning" onClick={this.postpone.bind(this, event, task, 2)}>
                                2시간
                            </button>
                        ))
                        actionButtons.push((
                            <button className="btn btn-warning" onClick={this.postpone.bind(this, event, task, 3)}>
                                3시간
                            </button>
                        ))
                        actionButtons.push((
                            <button className="btn btn-warning" onClick={this.postpone.bind(this, event, task, 6)}>
                                6시간
                            </button>
                        ))
                    }  
                    else{
                        actionButtons.push((
                            <button className="btn btn-default" label="Remind me later" onClick={this.showPostponeOptions.bind(this, event, task)}>
                                <span className="glyphicon glyphicon-send"></span> 나중에 알림
                            </button>

                        ));
                    }
                }
                else{
                    actionButtons.push((
                        <button className="btn btn-check" onClick={this.pause.bind(this, event, task)}>
                            <span className="glyphicon glyphicon-play"></span> 일시 정지
                        </button>
                    ))
                }
                
                if(task.state != TaskStateType.named.complete.id){
                    actionButtons.push((
                        <button className="btn btn-default" onClick={this.complete.bind(this, event, task)}>
                            <span className="glyphicon glyphicon-check"></span> 완료
                        </button>
                    ))
                }
            }
            if(task.state == TaskStateType.named.complete.id){
                actionButtons.push((
                    <button className="btn btn-check" onClick={this.uncomplete.bind(this, event, task)}>
                        <span className="glyphicon glyphicon-check"></span> 완료 취소
                    </button>
                ))
            }
        }

        let icon;
        if(event.loading){
            icon = <i className='fa fa-spinner fa-spin mr5'></i>
        }
        else{
            icon = task?<i className='fa fa-tag mr5'></i>:<i className='fa fa-calendar mr5'></i>
        }
        
        return (
            <div className={classnames({'mb10': true, 'event-item': true, loading: event.loading})}>
                <div className="modal-header mb10">
                    <h4 className="modal-title">
                        {icon}
                        {event.summary}
                    </h4> 
                </div>
                <If test={begin > now}>
                    <div>
                        <small className='mr10'>남은 시간</small> 
                        {getStringHourMinutes(begin-now)}
                    </div>    
                </If>
                <div>
                    <small className='mr10'>예상 시간</small> 
                    {length_hours>0?`${length_hours}시간`:''+ `${length_minuts}분`}
                </div>
                <div>
                    <div className='btn-group'>
                        {actionButtons}
                    </div>
                </div>
            </div>
        )
	}

    render(){
        let { events, tasks, global, config } = this.props;

        console.log('events: ', events);

        return (
            <div className={classnames({"modal-contents":true, 'disabled':this.props.disabled})}>
                <div className="modal-header">
                    <h4 className="modal-title">
                        다음 일정/할 일
                    </h4>
                </div>
                <div className="modal-body">
                    <div id='actionview-contents'>
                        {_.map(events, event=>this.renderItem(event, this.props.tasks.tasks[event.taskId]))}
                    </div>
                </div>
                <div className="modal-footer">
                    <label className='mr10'>footer</label> 
                </div>
            </div>
        );
    }
}

export default TaskActionView;
