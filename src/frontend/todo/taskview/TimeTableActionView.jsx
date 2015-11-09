import React from 'react';
import TaskActionView from './TaskActionView';
import TaskStateType from '../../../constants/TaskStateType';
import ActiveEventView from './ActiveEventView';
import _ from 'underscore';

class TimeTableActionView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TimeTableActionView';
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('TimeTableActionView', 'componentDidUpdate', this.refs)

        let needToShow0 = this.refs.taskActionView!=null && this.refs.taskActionView.state.needToShow;
        let needToShow1 = this.refs.activeEventView!=null && this.refs.activeEventView.state.needToShow;

        if(needToShow0 || needToShow1){
            var modal = $(React.findDOMNode(this));
            modal.modal({
                backdrop: true
                , keyboard: true
                , show: true
            });  
        }
    }

    render(){
        let now = Math.floor(Date.now()/(30*60*1000));

        let toStartEvents = _.filter(this.props.timetable.list, event=>{
            let task = this.props.tasks.tasks[event.taskId];
            console.log({event, task});
            if(!task)
                return false;

            console.log(event.tableslotStart, now, task.state, TaskStateType.named.start.id);
            if(event.tableslotStart <= now && task.state != TaskStateType.named.start.id){
                return true;
            }
            else{
                return false;
            }
        })

        console.log({toStartEvents});

        let currentActive = _.filter(this.props.timetable.list, event=>{
            let task = this.props.tasks.tasks[event.taskId];
            if(task){
                if(task.state == TaskStateType.named.start.id){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                if(event.tableslotStart<=now && tableslotStart<=event.tableslotEnd){
                    return true;
                }
                else{
                    return false;
                }
            }  
        })

        let currentActiveWithoutDismissed = _.filter(currentActive, item=>!item.dismissed);

        return (
            <div className="modal" tabIndex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-contents">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="gridSystemModalLabel">
                                    title
                                </h4>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="modal-body">
                                        <ActiveEventView 
                                            ref='activeEventView' 
                                            dispatch={this.props.dispatch}
                                            events={currentActive} 
                                            tasks={this.props.tasks}
                                            config={this.props.config}
                                            global={this.props.global} />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="modal-body">
                                        <TaskActionView 
                                            ref='taskActionView' 
                                            dispatch={this.props.dispatch}
                                            events={toStartEvents}
                                            tasks={this.props.tasks}
                                            disabled={currentActiveWithoutDismissed.length>0}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TimeTableActionView;
