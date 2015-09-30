// Task edit template.
// If it looks pretty, then we can use same edite template for displaying existing tasks.

class MyInput extends React.Component{
    constructor(){
      super();
    }

    handleChange(evt){
      this.setState({
        value: evt.target.value
      });
    }

    clear(){
      // Below line works
      React.findDOMNode(this).value = '';
      // Below line does not work.  I want to use react component as controlled form.
      // In other words, I don't want to manipulate dom object directly like above code.
      // TODO: Find a way to implement my idea.
      this.setState({
        value: ''
      });
    }

    render(){
        return (
          <input
            className={this.props.className}
            type="text"
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            defaultValue={this.props.initValue}
            />
        );
    }
};


class MyTextarea extends React.Component{
    constructor(){
      super();
    }

    handleChange(evt){
      this.setState({
        value: evt.target.value
      });
    }


    clear(){
      this.setState({
        value: ''
      });
    }

    render(){
        return (
          <textarea
            className={this.props.className}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            defaultValue={this.props.initValue}
            />
        );
    }
};

class TaskForm extends React.Component{
  constructor(){
    super();
    this.state = {
      name: '',
      description: ''
    };
  }

  isValid(){
    var errors = {};
    // Do validity check for every form here.

    if (!React.findDOMNode(this.refs.name).value){
      errors['name'] = 'name' + ' field is required';
    }
    this.setState({errors: errors});

    var isValid = true;
    for (var error in errors) {
      isValid = false;
      break;
    }
    return isValid;
  }

  getFormData(){
    var data={
      name: React.findDOMNode(this.refs.name).value,
      description: React.findDOMNode(this.refs.description).value
    };
    return data;
  }

  clearForm(){
    this.refs.name.clear();
    this.refs.description.clear();
  }


  render() {
    return (
      <div className={this.props.className}>
        <MyInput ref="name" className="task-name" placeholder="Task Name" />
        <MyTextarea ref="description" className="task-description" placeholder="Task Description"/>
      </div>
    );
  }
}

export default TaskForm;
