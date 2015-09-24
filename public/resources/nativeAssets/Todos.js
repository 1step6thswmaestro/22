(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TaskItem = (function (_React$Component) {
  _inherits(TaskItem, _React$Component);

  function TaskItem() {
    _classCallCheck(this, TaskItem);

    _get(Object.getPrototypeOf(TaskItem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(TaskItem, [{
    key: "getReadableDate",
    value: function getReadableDate(stdDate) {
      // Convert time format from DB, to readable format.
      // stdDate = "2015-09-17T01:00:00.000Z"
      var xx = stdDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}\.000Z/, function ($0, $1, $2, $3, $4, $5) {
        return $2 + "월 " + $3 + "일, " + $4 % 12 + ":" + $5 + (+$4 > 12 ? " PM" : " AM");
      });

      return xx;
    }
  }, {
    key: "render",
    value: function render() {
      var rawMarkup = marked(this.props.task.description.toString(), { sanitize: true });
      return React.createElement(
        "div",
        { className: "card" },
        React.createElement(
          "div",
          { className: "toggleview" },
          React.createElement("input", {
            className: "toggle",
            type: "checkbox",
            checked: this.props.task.timestampComplete != "",
            onChange: this.props.onToggle
          })
        ),
        React.createElement(
          "div",
          { className: "card-contents" },
          React.createElement(
            "div",
            { className: "task-name" },
            React.createElement(
              "h2",
              null,
              this.props.task.name
            )
          ),
          React.createElement(
            "div",
            { className: "task-importance" },
            "IMPORTANCE: ",
            this.props.task.importance
          ),
          React.createElement(
            "div",
            { className: "task-duedate" },
            "DUE: ",
            this.getReadableDate(this.props.task.timestampDuedate)
          ),
          React.createElement(
            "div",
            { className: "taskCreatedDate" },
            "CREATED: ",
            this.getReadableDate(this.props.task.timestampCreated)
          ),
          React.createElement(
            "div",
            { className: "taskStartedDate" },
            "STARTED: ",
            this.getReadableDate(this.props.task.timestampStart)
          ),
          React.createElement(
            "div",
            { className: "task-description" },
            React.createElement("span", { dangerouslySetInnerHTML: { __html: rawMarkup } })
          )
        ),
        React.createElement(
          "div",
          { className: "card-control" },
          React.createElement(
            "div",
            { className: "toolbar" },
            React.createElement("button", { className: "button postpone", label: "Remined me later", onClick: this.props.onPostpone }),
            React.createElement("button", { className: "button discard", label: "Discard this task", onClick: this.props.onDiscard })
          )
        )
      );
    }
  }]);

  return TaskItem;
})(React.Component);

;

exports["default"] = TaskItem;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TaskItem = require('./TaskItem');

var _TaskItem2 = _interopRequireDefault(_TaskItem);

var TaskForm = (function (_React$Component) {
  _inherits(TaskForm, _React$Component);

  function TaskForm() {
    _classCallCheck(this, TaskForm);

    _get(Object.getPrototypeOf(TaskForm.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TaskForm, [{
    key: 'handleSubmit',

    // TODO: Improve this form UI. It sucks.
    // No one ever gonna use this type of input form.

    value: function handleSubmit(e) {
      e.preventDefault();
      var taskModel = {};
      // Create objects from form and do validation test.
      for (var i in this.refs) {

        taskModel[i] = React.findDOMNode(this.refs[i]).value.trim();
        // When there is an empty field.
        if (!taskModel[i]) {
          alert('Please Enter Value: ' + i);
          return;
        }
      }

      console.log(taskModel);

      this.props.onTaskSubmit(taskModel);

      for (var i in this.refs) {
        React.findDOMNode(this.refs[i]).value = '';
      }
      return;
    }
  }, {
    key: 'render',
    value: function render() {
      // NOTE: Check if there is snippet for assigning location from address or getting current location. -->
      return React.createElement(
        'form',
        { className: 'taskForm', onSubmit: this.handleSubmit },
        React.createElement('input', { type: 'text', placeholder: 'Task Name', ref: 'name' }),
        React.createElement('input', { type: 'text', placeholder: 'Description', ref: 'description' }),
        React.createElement('input', { type: 'text', placeholder: 'Importance:0, 1, 2', ref: 'importance' }),
        React.createElement('input', { type: 'date', placeholder: 'timestampStart', ref: 'timestampStart' }),
        React.createElement('input', { type: 'date', placeholder: 'timestampDuedate', ref: 'timestampDuedate' }),
        React.createElement('input', { type: 'text', placeholder: 'Start Location', ref: 'locationstampStart' }),
        React.createElement('input', { type: 'submit', value: 'Post' })
      );
    }
  }]);

  return TaskForm;
})(React.Component);

;

var TodoApp = (function (_React$Component2) {
  _inherits(TodoApp, _React$Component2);

  function TodoApp() {
    _classCallCheck(this, TodoApp);

    _get(Object.getPrototypeOf(TodoApp.prototype), 'constructor', this).call(this);
    this.state = { tasks: [] };
  }

  _createClass(TodoApp, [{
    key: 'loadTasksFromServer',
    value: function loadTasksFromServer() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: (function (data) {
          this.setState({ tasks: data });
        }).bind(this),
        error: (function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }).bind(this)
      });
    }
  }, {
    key: 'handleTaskSubmit',
    value: function handleTaskSubmit(task) {
      // Optimistic Update. Update view before getting success response from server.
      var taskList = this.state.tasks;
      var newTasks = taskList.concat([task]);
      this.setState({ tasks: newTasks });

      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: task,
        success: (function (data) {
          this.setState({ tasks: data });
        }).bind(this),
        error: (function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }).bind(this)
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadTasksFromServer();
      setInterval(this.loadTasksFromServer, this.props.pollInterval);
    }
  }, {
    key: 'toggle',
    value: function toggle(todoToToggle) {
      // Implement toggle routine.
      // For example:
      // UPDATE VIEW
      // SEND THE EVENT TO SERVER.
      alert('Check Clicked');
    }
  }, {
    key: 'discard',
    value: function discard(todo) {
      // Implement discard routine.
      // For example:
      // REMOVE FROM VIEW
      // SEND REMOVAL EVENT TO SERVER.
      alert('Discard Clicked');
    }
  }, {
    key: 'render',
    value: function render() {
      console.log(this, this.state);
      var tasks = this.state.tasks;
      var taskItems = tasks.map(function (task) {
        return React.createElement(_TaskItem2['default'], {
          key: task.id,
          task: task,
          onToggle: this.toggle.bind(this, task),
          onDiscard: this.discard.bind(this, task)
        });
      }, this);

      return React.createElement(
        'div',
        { className: 'task-box' },
        React.createElement(
          'h1',
          null,
          'Give Me Task'
        ),
        React.createElement(TaskForm, { onTaskSubmit: this.handleTaskSubmit }),
        React.createElement(
          'div',
          { className: 'task-list' },
          taskItems
        )
      );
    }
  }]);

  return TodoApp;
})(React.Component);

;

exports['default'] = TodoApp;
module.exports = exports['default'];

},{"./TaskItem":1}],3:[function(require,module,exports){
//import React from 'react';
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _TodoApp = require('./TodoApp');

var _TodoApp2 = _interopRequireDefault(_TodoApp);

React.render(
// Load data from user-specific task list.
// The given data will be processed already. It means it has n-promising
// tasks for current context. In view it only render the data pretty.
React.createElement(_TodoApp2['default'], { url: 'tasks.json', pollInterval: 2000 }), document.getElementById('content'));

},{"./TodoApp":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaW5vc3BoZS9Eb2N1bWVudHMvZ2l0aHViL2dpdmVtZXRhc2svc3JjL2Zyb250ZW5kL3RvZG8vVGFza0l0ZW0uanN4IiwiL1VzZXJzL2lub3NwaGUvRG9jdW1lbnRzL2dpdGh1Yi9naXZlbWV0YXNrL3NyYy9mcm9udGVuZC90b2RvL1RvZG9BcHAuanN4IiwiL1VzZXJzL2lub3NwaGUvRG9jdW1lbnRzL2dpdGh1Yi9naXZlbWV0YXNrL3NyYy9mcm9udGVuZC90b2RvL2luZGV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDQ00sUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUNHLHlCQUFDLE9BQU8sRUFBQzs7O0FBR3RCLFVBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQ3RCLHFEQUFxRCxFQUNyRCxVQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDO0FBQ3pCLGVBQU8sRUFBRSxHQUFDLElBQUksR0FBQyxFQUFFLEdBQUMsS0FBSyxHQUFHLEVBQUUsR0FBQyxFQUFFLEdBQUMsR0FBRyxHQUFDLEVBQUUsSUFBRSxDQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsS0FBSyxHQUFDLEtBQUssQ0FBQSxBQUFDLENBQUE7T0FDNUQsQ0FBQyxDQUFDOztBQUVILGFBQU8sRUFBRSxDQUFDO0tBQ2I7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQ2pGLGFBQ0U7O1VBQUssU0FBUyxFQUFDLE1BQU07UUFDbkI7O1lBQUssU0FBUyxFQUFDLFlBQVk7VUFDekI7QUFDRSxxQkFBUyxFQUFDLFFBQVE7QUFDbEIsZ0JBQUksRUFBQyxVQUFVO0FBQ2YsbUJBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBRSxFQUFFLEFBQUM7QUFDL0Msb0JBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQztZQUM1QjtTQUNBO1FBQ047O1lBQUssU0FBUyxFQUFDLGVBQWU7VUFDNUI7O2NBQUssU0FBUyxFQUFDLFdBQVc7WUFDeEI7OztjQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7YUFBTTtXQUMzQjtVQUNOOztjQUFLLFNBQVMsRUFBQyxpQkFBaUI7O1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7V0FDbkM7VUFDTjs7Y0FBSyxTQUFTLEVBQUMsY0FBYzs7WUFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztXQUN4RDtVQUNOOztjQUFLLFNBQVMsRUFBQyxpQkFBaUI7O1lBQ3BCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7V0FDNUQ7VUFDTjs7Y0FBSyxTQUFTLEVBQUMsaUJBQWlCOztZQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztXQUMxRDtVQUNOOztjQUFLLFNBQVMsRUFBQyxrQkFBa0I7WUFDL0IsOEJBQU0sdUJBQXVCLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLEFBQUMsR0FBRztXQUNsRDtTQUNGO1FBQ047O1lBQUssU0FBUyxFQUFDLGNBQWM7VUFDM0I7O2NBQUssU0FBUyxFQUFDLFNBQVM7WUFDdEIsZ0NBQVEsU0FBUyxFQUFDLGlCQUFpQixFQUFDLEtBQUssRUFBQyxrQkFBa0IsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEFBQUMsR0FBRTtZQUM5RixnQ0FBUSxTQUFTLEVBQUMsZ0JBQWdCLEVBQUMsS0FBSyxFQUFDLG1CQUFtQixFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFBQyxHQUFHO1dBQzFGO1NBQ0Y7T0FDRixDQUNOO0tBQ0g7OztTQXJERyxRQUFRO0dBQVMsS0FBSyxDQUFDLFNBQVM7O0FBdURyQyxDQUFDOztxQkFFYSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3QkMxREYsWUFBWTs7OztJQUUzQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7Ozs7OztXQUlBLHNCQUFDLENBQUMsRUFBRTtBQUNkLE9BQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixVQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRW5CLFdBQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRzs7QUFFekIsaUJBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRTVELFlBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDakIsZUFBSyxDQUFDLHNCQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLGlCQUFPO1NBQ1I7T0FDRjs7QUFFRCxhQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUV2QixVQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkMsV0FBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFHO0FBQ3pCLGFBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7T0FDNUM7QUFDRCxhQUFPO0tBQ1I7OztXQUVLLGtCQUFHOztBQUVQLGFBQ0U7O1VBQU0sU0FBUyxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztRQUNyRCwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxXQUFXLEVBQUMsR0FBRyxFQUFDLE1BQU0sR0FBRztRQUN4RCwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsR0FBRyxFQUFDLGFBQWEsR0FBRztRQUNqRSwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxvQkFBb0IsRUFBQyxHQUFHLEVBQUMsWUFBWSxHQUFHO1FBQ3ZFLCtCQUFPLElBQUksRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLGdCQUFnQixFQUFDLEdBQUcsRUFBQyxnQkFBZ0IsR0FBRztRQUN2RSwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxrQkFBa0IsRUFBQyxHQUFHLEVBQUMsa0JBQWtCLEdBQUc7UUFDM0UsK0JBQU8sSUFBSSxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsZ0JBQWdCLEVBQUMsR0FBRyxFQUFDLG9CQUFvQixHQUFHO1FBQzNFLCtCQUFPLElBQUksRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLE1BQU0sR0FBRztPQUMvQixDQUNQO0tBQ0g7OztTQXpDRyxRQUFRO0dBQVMsS0FBSyxDQUFDLFNBQVM7O0FBMENyQyxDQUFDOztJQUVJLE9BQU87WUFBUCxPQUFPOztBQUNBLFdBRFAsT0FBTyxHQUNFOzBCQURULE9BQU87O0FBRVQsK0JBRkUsT0FBTyw2Q0FFRDtBQUNSLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7R0FDMUI7O2VBSkcsT0FBTzs7V0FLUSwrQkFBRztBQUNwQixPQUFDLENBQUMsSUFBSSxDQUFDO0FBQ0wsV0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztBQUNuQixnQkFBUSxFQUFFLE1BQU07QUFDaEIsYUFBSyxFQUFFLEtBQUs7QUFDWixlQUFPLEVBQUUsQ0FBQSxVQUFTLElBQUksRUFBRTtBQUN0QixjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7U0FDOUIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDWixhQUFLLEVBQUUsQ0FBQSxVQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ2hDLGlCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN2RCxDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKOzs7V0FFZSwwQkFBQyxJQUFJLEVBQUU7O0FBRXJCLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQzs7QUFFakMsT0FBQyxDQUFDLElBQUksQ0FBQztBQUNMLFdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUc7QUFDbkIsZ0JBQVEsRUFBRSxNQUFNO0FBQ2hCLFlBQUksRUFBRSxNQUFNO0FBQ1osWUFBSSxFQUFFLElBQUk7QUFDVixlQUFPLEVBQUUsQ0FBQSxVQUFTLElBQUksRUFBRTtBQUN0QixjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7U0FDOUIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDWixhQUFLLEVBQUUsQ0FBQSxVQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ2hDLGlCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN2RCxDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDM0IsaUJBQVcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNoRTs7O1dBRUssZ0JBQUMsWUFBWSxFQUFFOzs7OztBQUtuQixXQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7S0FFeEI7OztXQUVNLGlCQUFDLElBQUksRUFBRTs7Ozs7QUFLWixXQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUMxQjs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDN0IsVUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTtBQUN4QyxlQUNFO0FBQ0UsYUFBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEFBQUM7QUFDYixjQUFJLEVBQUUsSUFBSSxBQUFDO0FBQ1gsa0JBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEFBQUM7QUFDdkMsbUJBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEFBQUM7VUFDdkMsQ0FDSjtPQUNILEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRVQsYUFDRTs7VUFBSyxTQUFTLEVBQUMsVUFBVTtRQUN2Qjs7OztTQUFxQjtRQUNyQixvQkFBQyxRQUFRLElBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQyxHQUFHO1FBQ2pEOztZQUFLLFNBQVMsRUFBQyxXQUFXO1VBQ3ZCLFNBQVM7U0FDTjtPQUNGLENBQ047S0FDSDs7O1NBcEZHLE9BQU87R0FBUyxLQUFLLENBQUMsU0FBUzs7QUFxRnBDLENBQUM7O3FCQUVhLE9BQU87Ozs7Ozs7Ozt1QkNwSUYsV0FBVzs7OztBQUUvQixLQUFLLENBQUMsTUFBTTs7OztBQUlSLDRDQUFTLEdBQUcsRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFFLElBQUksQUFBQyxHQUFHLEVBQzlDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQ3ZDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBUYXNrSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcbiAgZ2V0UmVhZGFibGVEYXRlKHN0ZERhdGUpe1xuICAgIC8vIENvbnZlcnQgdGltZSBmb3JtYXQgZnJvbSBEQiwgdG8gcmVhZGFibGUgZm9ybWF0LlxuICAgIC8vIHN0ZERhdGUgPSBcIjIwMTUtMDktMTdUMDE6MDA6MDAuMDAwWlwiXG4gICAgdmFyIHh4ID0gc3RkRGF0ZS5yZXBsYWNlKFxuICAgICAgLyhcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pVChcXGR7Mn0pOihcXGR7Mn0pOlxcZHsyfVxcLjAwMFovLFxuICAgICAgZnVuY3Rpb24oJDAsJDEsJDIsJDMsJDQsJDUpe1xuICAgICAgICByZXR1cm4gJDIrXCLsm5QgXCIrJDMrXCLsnbwsIFwiICsgJDQlMTIrXCI6XCIrJDUrKCskND4xMj9cIiBQTVwiOlwiIEFNXCIpXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHh4O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciByYXdNYXJrdXAgPSBtYXJrZWQodGhpcy5wcm9wcy50YXNrLmRlc2NyaXB0aW9uLnRvU3RyaW5nKCksIHtzYW5pdGl6ZTogdHJ1ZX0pO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2dnbGV2aWV3XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2dnbGVcIlxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIGNoZWNrZWQ9e3RoaXMucHJvcHMudGFzay50aW1lc3RhbXBDb21wbGV0ZSE9XCJcIn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uVG9nZ2xlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1jb250ZW50c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFzay1uYW1lXCI+XG4gICAgICAgICAgICA8aDI+e3RoaXMucHJvcHMudGFzay5uYW1lfTwvaDI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YXNrLWltcG9ydGFuY2VcIj5cbiAgICAgICAgICAgIElNUE9SVEFOQ0U6IHt0aGlzLnByb3BzLnRhc2suaW1wb3J0YW5jZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhc2stZHVlZGF0ZVwiPlxuICAgICAgICAgICAgRFVFOiB7dGhpcy5nZXRSZWFkYWJsZURhdGUodGhpcy5wcm9wcy50YXNrLnRpbWVzdGFtcER1ZWRhdGUpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFza0NyZWF0ZWREYXRlXCI+XG4gICAgICAgICAgICBDUkVBVEVEOiB7dGhpcy5nZXRSZWFkYWJsZURhdGUodGhpcy5wcm9wcy50YXNrLnRpbWVzdGFtcENyZWF0ZWQpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFza1N0YXJ0ZWREYXRlXCI+XG4gICAgICAgICAgICBTVEFSVEVEOiB7dGhpcy5nZXRSZWFkYWJsZURhdGUodGhpcy5wcm9wcy50YXNrLnRpbWVzdGFtcFN0YXJ0KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhc2stZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiByYXdNYXJrdXB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRyb2xcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvb2xiYXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnV0dG9uIHBvc3Rwb25lXCIgbGFiZWw9XCJSZW1pbmVkIG1lIGxhdGVyXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblBvc3Rwb25lfS8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ1dHRvbiBkaXNjYXJkXCIgbGFiZWw9XCJEaXNjYXJkIHRoaXMgdGFza1wiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25EaXNjYXJkfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgVGFza0l0ZW07XG4iLCJpbXBvcnQgVGFza0l0ZW0gZnJvbSAnLi9UYXNrSXRlbSdcblxuY2xhc3MgVGFza0Zvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XG4gIC8vIFRPRE86IEltcHJvdmUgdGhpcyBmb3JtIFVJLiBJdCBzdWNrcy5cbiAgLy8gTm8gb25lIGV2ZXIgZ29ubmEgdXNlIHRoaXMgdHlwZSBvZiBpbnB1dCBmb3JtLlxuXG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciB0YXNrTW9kZWwgPSB7fTtcbiAgICAvLyBDcmVhdGUgb2JqZWN0cyBmcm9tIGZvcm0gYW5kIGRvIHZhbGlkYXRpb24gdGVzdC5cbiAgICBmb3IgKCB2YXIgaSBpbiB0aGlzLnJlZnMgKSB7XG5cbiAgICAgIHRhc2tNb2RlbFtpXSA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmc1tpXSkudmFsdWUudHJpbSgpO1xuICAgICAgLy8gV2hlbiB0aGVyZSBpcyBhbiBlbXB0eSBmaWVsZC5cbiAgICAgIGlmICghdGFza01vZGVsW2ldKSB7XG4gICAgICAgIGFsZXJ0KCdQbGVhc2UgRW50ZXIgVmFsdWU6ICcgKyBpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKHRhc2tNb2RlbCk7XG5cbiAgICB0aGlzLnByb3BzLm9uVGFza1N1Ym1pdCh0YXNrTW9kZWwpO1xuXG4gICAgZm9yICggdmFyIGkgaW4gdGhpcy5yZWZzICkge1xuICAgICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzW2ldKS52YWx1ZSA9ICcnO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gTk9URTogQ2hlY2sgaWYgdGhlcmUgaXMgc25pcHBldCBmb3IgYXNzaWduaW5nIGxvY2F0aW9uIGZyb20gYWRkcmVzcyBvciBnZXR0aW5nIGN1cnJlbnQgbG9jYXRpb24uIC0tPlxuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ0YXNrRm9ybVwiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGFzayBOYW1lXCIgcmVmPVwibmFtZVwiIC8+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRGVzY3JpcHRpb25cIiByZWY9XCJkZXNjcmlwdGlvblwiIC8+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiSW1wb3J0YW5jZTowLCAxLCAyXCIgcmVmPVwiaW1wb3J0YW5jZVwiIC8+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIHBsYWNlaG9sZGVyPVwidGltZXN0YW1wU3RhcnRcIiByZWY9XCJ0aW1lc3RhbXBTdGFydFwiIC8+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIHBsYWNlaG9sZGVyPVwidGltZXN0YW1wRHVlZGF0ZVwiIHJlZj1cInRpbWVzdGFtcER1ZWRhdGVcIiAvPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlN0YXJ0IExvY2F0aW9uXCIgcmVmPVwibG9jYXRpb25zdGFtcFN0YXJ0XCIgLz5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlBvc3RcIiAvPlxuICAgICAgPC9mb3JtPlxuICAgICk7XG4gIH1cbn07XG5cbmNsYXNzIFRvZG9BcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0ge3Rhc2tzOiBbXX07XG4gIH1cbiAgbG9hZFRhc2tzRnJvbVNlcnZlcigpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLnVybCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Rhc2tzOiBkYXRhfSk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlVGFza1N1Ym1pdCh0YXNrKSB7XG4gICAgLy8gT3B0aW1pc3RpYyBVcGRhdGUuIFVwZGF0ZSB2aWV3IGJlZm9yZSBnZXR0aW5nIHN1Y2Nlc3MgcmVzcG9uc2UgZnJvbSBzZXJ2ZXIuXG4gICAgdmFyIHRhc2tMaXN0ID0gdGhpcy5zdGF0ZS50YXNrcztcbiAgICB2YXIgbmV3VGFza3MgPSB0YXNrTGlzdC5jb25jYXQoW3Rhc2tdKTtcbiAgICB0aGlzLnNldFN0YXRlKHt0YXNrczogbmV3VGFza3N9KTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMucHJvcHMudXJsLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IHRhc2ssXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Rhc2tzOiBkYXRhfSk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5sb2FkVGFza3NGcm9tU2VydmVyKCk7XG4gICAgc2V0SW50ZXJ2YWwodGhpcy5sb2FkVGFza3NGcm9tU2VydmVyLCB0aGlzLnByb3BzLnBvbGxJbnRlcnZhbCk7XG4gIH1cblxuICB0b2dnbGUodG9kb1RvVG9nZ2xlKSB7XG4gICAgLy8gSW1wbGVtZW50IHRvZ2dsZSByb3V0aW5lLlxuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vIFVQREFURSBWSUVXXG4gICAgLy8gU0VORCBUSEUgRVZFTlQgVE8gU0VSVkVSLlxuICAgIGFsZXJ0KCdDaGVjayBDbGlja2VkJyk7XG5cbiAgfVxuXG4gIGRpc2NhcmQodG9kbykge1xuICAgIC8vIEltcGxlbWVudCBkaXNjYXJkIHJvdXRpbmUuXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gUkVNT1ZFIEZST00gVklFV1xuICAgIC8vIFNFTkQgUkVNT1ZBTCBFVkVOVCBUTyBTRVJWRVIuXG4gICAgYWxlcnQoJ0Rpc2NhcmQgQ2xpY2tlZCcpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMsIHRoaXMuc3RhdGUpO1xuICAgIHZhciB0YXNrcyA9IHRoaXMuc3RhdGUudGFza3M7XG4gICAgdmFyIHRhc2tJdGVtcyA9IHRhc2tzLm1hcChmdW5jdGlvbiAodGFzaykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRhc2tJdGVtXG4gICAgICAgICAga2V5PXt0YXNrLmlkfVxuICAgICAgICAgIHRhc2s9e3Rhc2t9XG4gICAgICAgICAgb25Ub2dnbGU9e3RoaXMudG9nZ2xlLmJpbmQodGhpcywgdGFzayl9XG4gICAgICAgICAgb25EaXNjYXJkPXt0aGlzLmRpc2NhcmQuYmluZCh0aGlzLCB0YXNrKX1cbiAgICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhc2stYm94XCI+XG4gICAgICAgIDxoMT5HaXZlIE1lIFRhc2s8L2gxPlxuICAgICAgICA8VGFza0Zvcm0gb25UYXNrU3VibWl0PXt0aGlzLmhhbmRsZVRhc2tTdWJtaXR9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFzay1saXN0XCI+XG4gICAgICAgICAge3Rhc2tJdGVtc31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUb2RvQXBwO1xuIiwiLy9pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRvZG9BcHAgZnJvbSAnLi9Ub2RvQXBwJztcblxuUmVhY3QucmVuZGVyKFxuICAgIC8vIExvYWQgZGF0YSBmcm9tIHVzZXItc3BlY2lmaWMgdGFzayBsaXN0LlxuICAgIC8vIFRoZSBnaXZlbiBkYXRhIHdpbGwgYmUgcHJvY2Vzc2VkIGFscmVhZHkuIEl0IG1lYW5zIGl0IGhhcyBuLXByb21pc2luZ1xuICAgIC8vIHRhc2tzIGZvciBjdXJyZW50IGNvbnRleHQuIEluIHZpZXcgaXQgb25seSByZW5kZXIgdGhlIGRhdGEgcHJldHR5LlxuICAgIDxUb2RvQXBwIHVybD1cInRhc2tzLmpzb25cIiBwb2xsSW50ZXJ2YWw9ezIwMDB9IC8+XG4gICAgLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuIl19
