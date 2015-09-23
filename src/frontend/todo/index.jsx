//import React from 'react';
import TodoApp from './TodoApp';

React.render(
    // Load data from user-specific task list.
    // The given data will be processed already. It means it has n-promising
    // tasks for current context. In view it only render the data pretty.
    <TodoApp url="tasks.json" pollInterval={2000} />
    , document.getElementById('content')
);
