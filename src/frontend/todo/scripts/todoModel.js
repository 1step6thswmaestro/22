/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.tasks = [];
		this.getData();
		this.onChanges = [];
	};

	app.TodoModel.prototype.setData = function (data) {
		this.tasks = data;
	};

	app.TodoModel.prototype.getData = function () {
		Utils.store(this.key, this);
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		// store current app's state into DB, and update view by calling every callbacks.
		Utils.store(this.key, this.setTasks, this.todos);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = function (title) {
		this.todos = this.todos.concat({
			id: Utils.uuid(),
			title: title,
			completed: false
		});

		this.inform();
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// todo items themselves.
		this.todos = this.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		});

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});

		this.inform();
	};

	app.TodoModel.prototype.disacrd = function (todo) {
		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

})();
