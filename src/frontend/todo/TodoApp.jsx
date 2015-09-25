import TaskItem from './TaskItem'

class TaskForm extends React.Component{
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

class TodoApp extends React.Component{
  constructor(){
    super();
    this.state = {tasks: []};
  }
  loadTasksFromServer() {
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
  }

  handleTaskSubmit(task) {
    // Optimistic Update. Update view before getting success response from server.
    var taskList = this.state.tasks;
    var newTasks = taskList.concat([task]);
    this.setState({tasks: newTasks});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: task,
      success: function(res) {
        // Do NOTHING.
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidMount() {
    this.loadTasksFromServer();
    setInterval(this.loadTasksFromServer.bind(this), this.props.pollInterval);
  }

  toggle(taskToToggle) {
    // Implement toggle routine.
    // For example:
    // UPDATE VIEW
    // SEND THE EVENT TO SERVER.
    alert('Check Clicked');

  }

  discard(task) {
    // Implement discard routine.
    // For example:
    // REMOVE FROM VIEW
    // SEND REMOVAL EVENT TO SERVER.

    // What is good way to call REST API for deletion instead of ajax call?
    $.ajax({
      url: 'v1/tasks/'+task._id,
      type: 'DELETE',
      success: function(result) {
        // Update current view.
        this.loadTasksFromServer();
      }.bind(this)
    });
  }

  render() {
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

export default TodoApp;
