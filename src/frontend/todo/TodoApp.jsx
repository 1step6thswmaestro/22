import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux';
import TaskForm from './TaskForm';
import { fetchList, makeNewItem, removeItem } from './actions/tasks'
import TaskItem from './TaskItem'
import _ from 'underscore'

class TodoApp extends React.Component{
  constructor(){
    super();
    this.state = {tasks: []};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchList());
  }


  handleTaskSubmit(task) {
    const { dispatch } = this.props;
    console.log('handleTaskSubmit : ', this, task, dispatch);
    dispatch(makeNewItem(task));
  }

  discard(task){
    const { dispatch } = this.props;
    dispatch(removeItem(task));
  }
  
  render() {
    var tasks = this.props.tasks.list;
    console.log(tasks);
    var taskItems = _.map(tasks, function (task) {
      return (
        <TaskItem
          key={task.id}
          task={task} 
          onDiscard={this.discard.bind(this, task)} />)
    }, this);

    return (
      <div className="task-box">
        <h1>Give Me Task</h1>
        <TaskForm onTaskSubmit={this.handleTaskSubmit.bind(this)} />
        <div className="task-list">
          {taskItems}
        </div>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    tasks: Object.assign({}, state, {list: _.filter(state.tasks.list, item => !item.removed)})
  }
};

export default connect(
  mapStateToProps
)(TodoApp);
