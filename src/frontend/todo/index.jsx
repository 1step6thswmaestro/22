//import React from 'react';
import TodoList from './TodoList';

React.render(
    // Load data from user-specific task list.
    // The given data will be processed already. It means it has n-promising
    // tasks for current context. In view it only render the data pretty.
    <TodoList/>
    , document.getElementById('content')
);
