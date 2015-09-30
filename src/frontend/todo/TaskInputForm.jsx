import React from 'react'

// TaskIputForm gives consistent look with other task items.
// We are going to use same card shape design for the input form.

// This class make card shaped for the new task which is waiting for user input.
// There are other class that make card form for existing tasks. So design must be consistent.

import TaskForm from './TaskForm'

class TaskInputForm extends React.Component{
  constructor(){
    super();
    this.state = {
      name: '',
      description: ''
    };
  }
  handleSubmit() {
    console.log('handleSubmit : ', this.refs.taskForm.getFormData());
    if (this.refs.taskForm.isValid()) {
      this.props.onTaskSubmit(this.refs.taskForm.getFormData());
      this.refs.taskForm.clearForm();
    }
    else{
      var errormsg='';
      var errors = this.refs.taskForm.state.errors;
      for (var error in errors) {
        errormsg=errormsg+errors[error]+'\n';
      }
      alert('Error: Check your input\n'+errormsg);
    }
  }



/*  handleSubmit(e) {
    // OLD
    e.preventDefault();
    var taskModel = {};
    // Create objects from form and do validation test.
    console.log('Refs:'+this.refs);
    for ( var i in this.refs ) {
      console.log('ref:'+i);
      console.log('ref-val:'+this.refs.i);
      console.log('  value:'+React.findDOMNode(this).value);

      // taskModel[i] = React.findDOMNode(this.refs[i]).value.trim();

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
  }*/

  render() {
    // NOTE: Check if there is snippet for assigning location from address or getting current location. -->

    // TODO: I want to fire onClick event when user press ctrl+enter key.

    return (
      <div className="card">
        <div className='card-contents'>
          <TaskForm ref='taskForm'/>
          
          <div className="card-control">
            <div className="toolbar">
              <div className='row'>
                <div className='col-md-6'>
                  <button className="btn btn-default postpone" onClick={this.props.onPostpone}>Remined me later</button>
                </div>
                <div className='col-md-6'>
                  <button className="btn btn-default discard" onClick={this.props.onDiscard}>Discard this task</button>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12'>
                  <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}>Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TaskInputForm;
