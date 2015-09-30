import React from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import { configureStore } from './store/configureStore'

let store = configureStore({
  tasks: {
	list: []
  }
});

console.log('index.jsx');

React.render(
	<Provider store={store}>
		{() => <TodoApp />}
	</Provider>
	, document.getElementById('content')
);
