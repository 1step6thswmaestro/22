import TodoItem from './TodoItem';

var TodoList = React.createClass({
  getInitialState() {
    return {
      todos: [
        {id:1, text:"advent calendar1"},
        {id:2, text:"advent calendar2"},
        {id:3, text:"advent calendar3"}
      ]
    };
  },
  render() {
    var todos = this.state.todos.map((todo) => {
      return (<li key={todo.id}>
        <TodoItem todo={todo}/>
      </li>);
    });
    return <ul>{todos}</ul>;
  }
});

export default TodoList;
