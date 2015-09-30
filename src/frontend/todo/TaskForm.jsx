import React from 'react';
import TaskItem from './TaskItem'

export default class TaskForm extends React.Component{
  // TODO: Improve this form UI. It sucks.
  // No one ever gonna use this type of input form.

  handleSubmit(e) {
    e.preventDefault();
    var taskModel = {};
    // Create objects from form and do validation test.
    for ( var i in this.refs ) {

      taskModel[i] = React.findDOMNode(this.refs[i]).value.trim();

    }

    // At least user have to enter name of the task
    if (!taskModel.name) {
      alert('Please enter task name');
      return;
    }

    console.log(taskModel);

    this.props.onTaskSubmit(taskModel);

    for ( var i in this.refs ) {
      React.findDOMNode(this.refs[i]).value = '';
    }
    return;
  }

  render() {
    // NOTE: Check if there is snippet for assigning location from address or getting current location. -->
    return (
      <form className="taskForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="Task Name" ref="name" />
        <input type="text" placeholder="Description" ref="description" />
        <input type="text" placeholder="Importance:0, 1, 2" ref="importance" />
        <input type="date" placeholder="timestampStart" ref="timestampStart" />
        <input type="date" placeholder="timestampDuedate" ref="timestampDuedate" />
        <input type="text" placeholder="Start Location" ref="locationstampStart" />
        <input type="submit" value="Post" />
      </form>
    );
  }
};