class TodoItem extends React.Component{
	render(){
		return(
			<div>
				{this.props.todo.text}
			</div>
		);
	}
};

// TodoItem.propTypes = {
// 	todo: React.PropTypes.shape({
// 	  text: React.PropTypes.string.isRequired
// 	})
// };

export default TodoItem;
