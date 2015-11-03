import React from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import { configureStore } from './store/configureStore'

let store = configureStore({
  tasks: {
  	tasks: {}
	, _list: []
	, _plist: []
	, _tlist: []
  }, 
  user: {
  	intergration: {}
  }, 
  timetable: {
  	tablelist: {}
  }
});

global.store = store;

React.render(
	<Provider store={store}>
		{() => <TodoApp />}
	</Provider>
	, document.getElementById('content')
);
