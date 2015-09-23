var app = app || {};

(function () {
  'use strict';

  var TaskItem = app.TaskItem;

  var TaskForm = React.createClass({
    // TODO: Improve this form UI. It sucks.
    // No one ever gonna use this type of input form.

    handleSubmit: function(e) {
      e.preventDefault();
      var taskModel = {};
      // Create objects from form and do validation test.
      for ( var i in this.refs ) {

        taskModel[i] = React.findDOMNode(this.refs[i]).value.trim();
        // When there is an empty field.
        if (!taskModel[i]) {
          alert('Please Enter Value: ' + i);
          return;
        }
      }

      console.log(taskModel);

      this.props.onTaskSubmit(taskModel);

      for ( var i in this.refs ) {
        React.findDOMNode(this.refs[i]).value = '';
      }
      return;
    },
    render: function() {
      // NOTE: Check if there is snippet for assigning location from address or getting current location. -->
      return (
        <form className="taskForm" onSubmit={this.handleSubmit}>
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
  });

  var TodoApp = React.createClass({
    loadTasksFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({tasks: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    handleTaskSubmit: function(task) {
      // Optimistic Update. Update view before getting success response from server.
      var taskList = this.state.tasks;
      var newTasks = taskList.concat([task]);
      this.setState({tasks: newTasks});

      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: task,
        success: function(data) {
          this.setState({tasks: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return {tasks: []};
    },
    componentDidMount: function() {
      this.loadTasksFromServer();
      setInterval(this.loadTasksFromServer, this.props.pollInterval);
    },

    toggle: function (todoToToggle) {
      // Implement toggle routine.
      // For example:
      // UPDATE VIEW
      // SEND THE EVENT TO SERVER.
      alert('Check Clicked');

		},

		discard: function (todo) {
      // Implement discard routine.
      // For example:
      // REMOVE FROM VIEW
      // SEND REMOVAL EVENT TO SERVER.
      alert('Discard Clicked');
		},
    render: function() {
      var tasks = this.state.tasks;
      var taskItems = tasks.map(function (task) {
        return (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={this.toggle.bind(this, task)}
            onDiscard={this.discard.bind(this, task)}
          />
        );
      }, this);

      return (
        <div className="taskBox">
        <h1>Give Me Task</h1>
        <TaskForm onTaskSubmit={this.handleTaskSubmit} />
        <div className="taskList">
          {taskItems}
        </div>
        </div>
      );
    }
  });

  React.render(
    // Load data from user-specific task list.
    // The given data will be processed already. It means it has n-promising
    // tasks for current context. In view it only render the data pretty.
    <TodoApp url="tasks.json" pollInterval={2000} />,
    document.getElementById('content')
  );

})();
