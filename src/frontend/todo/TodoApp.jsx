import TaskItem from './TaskItem'
import TaskInputForm from './TaskInputForm'

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
        <TaskInputForm
          onTaskSubmit={this.handleTaskSubmit.bind(this)}
          onToggle={this.toggle.bind(this)}
          onDiscard={this.discard.bind(this)}
          />
        <div className="task-list">
          {taskItems}
        </div>
      </div>
    );
  }
};

export default TodoApp;
