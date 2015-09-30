import React from 'react'

// Task edit template.
// If it looks pretty, then we can use same edite template for displaying existing tasks.

class MyInput extends React.Component{
    constructor(){
      super();
      this.state = {}
    }

    handleChange(evt){
      console.log('handleChange : ', evt);
      this.setState({
        value: evt.target.value
      });
    }

    clear(){
      // Below line works
      React.findDOMNode(this).querySelector('input').value = '';
      // Below line does not work.  I want to use react component as controlled form.
      // In other words, I don't want to manipulate dom object directly like above code.
      // TODO: Find a way to implement my idea.
      this.setState({
        value: ''
      });
    }

    render(){
        return (
          <div className='form-group'>
            <input
              className="form-control"
              type="text"
              onChange={this.handleChange.bind(this)}
              placeholder={this.props.placeholder}
              defaultValue={this.props.initValue}
              />
          </div>
        );
    }
};


class MyTextarea extends React.Component{
    constructor(){
      super();
      this.state = {};
    }

    handleChange(evt){
      this.setState({
        value: evt.target.value
      });
    }


    clear(){
      React.findDOMNode(this).querySelector('textarea').value = '';
      this.setState({
        value: ''
      });
    }

    render(){
        return (
          <textarea
            className="form-control"
            onChange={this.handleChange.bind(this)}
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
    let name = undefined;
    if(this.refs.name.state)
      name = this.refs.name.state.value;

    var errors = {};
    // Do validity check for every form here.

    if (!name){
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
    console.log('getFormData : ', this.refs);
    let name = this.refs.name.state.value;
    let description = this.refs.description.state.value;

    return {name, description};
  }

  clearForm(){
    this.refs.name.clear();
    this.refs.description.clear();
  }


  render() {
    return (
      <div className='form-group-attached'>
        <div className='row'>
          <div className='col-md-12'>
            <MyInput ref="name" placeholder="Task Name" />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='form-group'>
              <input className='form-control'/>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='form-group'>
              <input className='form-control'/>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='form-group'>
              <MyTextarea ref="description" placeholder="Task Description"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskForm;
