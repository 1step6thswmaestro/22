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

    _get(Object.getPrototypeOf(TodoApp.prototype), 'constructor', this).apply(this, arguments);
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
    key: 'getInitialState',
    value: function getInitialState() {
      return { tasks: [] };
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaW5zaWtrL0Rvd25sb2Fkcy93b3JrL2dpdmVtZXRhc2svc3JjL2Zyb250ZW5kL3RvZG8vVGFza0l0ZW0uanN4IiwiL1VzZXJzL2luc2lray9Eb3dubG9hZHMvd29yay9naXZlbWV0YXNrL3NyYy9mcm9udGVuZC90b2RvL1RvZG9BcHAuanN4IiwiL1VzZXJzL2luc2lray9Eb3dubG9hZHMvd29yay9naXZlbWV0YXNrL3NyYy9mcm9udGVuZC90b2RvL2luZGV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDQ00sUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUNHLHlCQUFDLE9BQU8sRUFBQzs7O0FBR3RCLFVBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQ3RCLHFEQUFxRCxFQUNyRCxVQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDO0FBQ3pCLGVBQU8sRUFBRSxHQUFDLElBQUksR0FBQyxFQUFFLEdBQUMsS0FBSyxHQUFHLEVBQUUsR0FBQyxFQUFFLEdBQUMsR0FBRyxHQUFDLEVBQUUsSUFBRSxDQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsS0FBSyxHQUFDLEtBQUssQ0FBQSxBQUFDLENBQUE7T0FDNUQsQ0FBQyxDQUFDOztBQUVILGFBQU8sRUFBRSxDQUFDO0tBQ2I7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQ2pGLGFBQ0U7O1VBQUssU0FBUyxF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LFdBQVc7VUFDdkIsU0FBUztTQUNOO09BQ0YsQ0FDTjtLQUNIOzs7U0FuRkcsT0FBTztHQUFTLEtBQUssQ0FBQyxTQUFTOztBQW9GcEMsQ0FBQzs7cUJBRWEsT0FBTzs7Ozs7Ozs7O3VCQ25JRixXQUFXOzs7O0FBRS9CLEtBQUssQ0FBQyxNQUFNOzs7O0FBSVIsNENBQVMsR0FBRyxFQUFDLFlBQVksRUFBQyxZQUFZLEVBQUUsSUFBSSxBQUFDLEdBQUcsRUFDOUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FDdkMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNsYXNzIFRhc2tJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xuICBnZXRSZWFkYWJsZURhdGUoc3RkRGF0ZSl7XG4gICAgLy8gQ29udmVydCB0aW1lIGZvcm1hdCBmcm9tIERCLCB0byByZWFkYWJsZSBmb3JtYXQuXG4gICAgLy8gc3RkRGF0ZSA9IFwiMjAxNS0wOS0xN1QwMTowMDowMC4wMDBaXCJcbiAgICB2YXIgeHggPSBzdGREYXRlLnJlcGxhY2UoXG4gICAgICAvKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6XFxkezJ9XFwuMDAwWi8sXG4gICAgICBmdW5jdGlvbigkMCwkMSwkMiwkMywkNCwkNSl7XG4gICAgICAgIHJldHVybiAkMitcIuyblCBcIiskMytcIuydvCwgXCIgKyAkNCUxMitcIjpcIiskNSsoKyQ0PjEyP1wiIFBNXCI6XCIgQU1cIilcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4geHg7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJhd01hcmt1cCA9IG1hcmtlZCh0aGlzLnByb3BzLnRhc2suZGVzY3JpcHRpb24udG9TdHJpbmcoKSwge3Nhbml0aXplOiB0cnVlfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvZ2dsZXZpZXdcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRvZ2dsZVwiXG4gICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5wcm9wcy50YXNrLnRpbWVzdGFtcENvbXBsZXRlIT1cIlwifVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25Ub2dnbGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWNvbnRlbnRzXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YXNrLW5hbWVcIj5cbiAgICAgICAgICAgIDxoMj57dGhpcy5wcm9wcy50YXNrLm5hbWV9PC9oMj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhc2staW1wb3J0YW5jZVwiPlxuICAgICAgICAgICAgSU1QT1JUQU5DRToge3RoaXMucHJvcHMudGFzay5pbXBvcnRhbmNlfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFzay1kdWVkYXRlXCI+XG4gICAgICAgICAgICBEVUU6IHt0aGlzLmdldFJlYWRhYmxlRGF0ZSh0aGlzLnByb3BzLnRhc2sudGltZXN0YW1wRHVlZGF0ZSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YXNrQ3JlYXRlZERhdGVcIj5cbiAgICAgICAgICAgIENSRUFURUQ6IHt0aGlzLmdldFJlYWRhYmxlRGF0ZSh0aGlzLnByb3BzLnRhc2sudGltZXN0YW1wQ3JlYXRlZCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YXNrU3RhcnRlZERhdGVcIj5cbiAgICAgICAgICAgIFNUQVJURUQ6IHt0aGlzLmdldFJlYWRhYmxlRGF0ZSh0aGlzLnByb3BzLnRhc2sudGltZXN0YW1wU3RhcnQpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFzay1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgPHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHJhd01hcmt1cH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtY29udHJvbFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9vbGJhclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidXR0b24gcG9zdHBvbmVcIiBsYWJlbD1cIlJlbWluZWQgbWUgbGF0ZXJcIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uUG9zdHBvbmV9Lz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnV0dG9uIGRpc2NhcmRcIiBsYWJlbD1cIkRpc2NhcmQgdGhpcyB0YXNrXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkRpc2NhcmR9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrSXRlbTtcbiIsImltcG9ydCBUYXNrSXRlbSBmcm9tICcuL1Rhc2tJdGVtJ1xuXG5jbGFzcyBUYXNrRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcbiAgLy8gVE9ETzogSW1wcm92ZSB0aGlzIGZvcm0gVUkuIEl0IHN1Y2tzLlxuICAvLyBObyBvbmUgZXZlciBnb25uYSB1c2UgdGhpcyB0eXBlIG9mIGlucHV0IGZvcm0uXG5cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHRhc2tNb2RlbCA9IHt9O1xuICAgIC8vIENyZWF0ZSBvYmplY3RzIGZyb20gZm9ybSBhbmQgZG8gdmFsaWRhdGlvbiB0ZXN0LlxuICAgIGZvciAoIHZhciBpIGluIHRoaXMucmVmcyApIHtcblxuICAgICAgdGFza01vZGVsW2ldID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzW2ldKS52YWx1ZS50cmltKCk7XG4gICAgICAvLyBXaGVuIHRoZXJlIGlzIGFuIGVtcHR5IGZpZWxkLlxuICAgICAgaWYgKCF0YXNrTW9kZWxbaV0pIHtcbiAgICAgICAgYWxlcnQoJ1BsZWFzZSBFbnRlciBWYWx1ZTogJyArIGkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2codGFza01vZGVsKTtcblxuICAgIHRoaXMucHJvcHMub25UYXNrU3VibWl0KHRhc2tNb2RlbCk7XG5cbiAgICBmb3IgKCB2YXIgaSBpbiB0aGlzLnJlZnMgKSB7XG4gICAgICBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnNbaV0pLnZhbHVlID0gJyc7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBOT1RFOiBDaGVjayBpZiB0aGVyZSBpcyBzbmlwcGV0IGZvciBhc3NpZ25pbmcgbG9jYXRpb24gZnJvbSBhZGRyZXNzIG9yIGdldHRpbmcgY3VycmVudCBsb2NhdGlvbi4gLS0+XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInRhc2tGb3JtXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUYXNrIE5hbWVcIiByZWY9XCJuYW1lXCIgLz5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJEZXNjcmlwdGlvblwiIHJlZj1cImRlc2NyaXB0aW9uXCIgLz5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJJbXBvcnRhbmNlOjAsIDEsIDJcIiByZWY9XCJpbXBvcnRhbmNlXCIgLz5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgcGxhY2Vob2xkZXI9XCJ0aW1lc3RhbXBTdGFydFwiIHJlZj1cInRpbWVzdGFtcFN0YXJ0XCIgLz5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgcGxhY2Vob2xkZXI9XCJ0aW1lc3RhbXBEdWVkYXRlXCIgcmVmPVwidGltZXN0YW1wRHVlZGF0ZVwiIC8+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiU3RhcnQgTG9jYXRpb25cIiByZWY9XCJsb2NhdGlvbnN0YW1wU3RhcnRcIiAvPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiUG9zdFwiIC8+XG4gICAgICA8L2Zvcm0+XG4gICAgKTtcbiAgfVxufTtcblxuY2xhc3MgVG9kb0FwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcbiAgbG9hZFRhc2tzRnJvbVNlcnZlcigpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLnVybCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Rhc2tzOiBkYXRhfSk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlVGFza1N1Ym1pdCh0YXNrKSB7XG4gICAgLy8gT3B0aW1pc3RpYyBVcGRhdGUuIFVwZGF0ZSB2aWV3IGJlZm9yZSBnZXR0aW5nIHN1Y2Nlc3MgcmVzcG9uc2UgZnJvbSBzZXJ2ZXIuXG4gICAgdmFyIHRhc2tMaXN0ID0gdGhpcy5zdGF0ZS50YXNrcztcbiAgICB2YXIgbmV3VGFza3MgPSB0YXNrTGlzdC5jb25jYXQoW3Rhc2tdKTtcbiAgICB0aGlzLnNldFN0YXRlKHt0YXNrczogbmV3VGFza3N9KTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMucHJvcHMudXJsLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IHRhc2ssXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Rhc2tzOiBkYXRhfSk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7dGFza3M6IFtdfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMubG9hZFRhc2tzRnJvbVNlcnZlcigpO1xuICAgIHNldEludGVydmFsKHRoaXMubG9hZFRhc2tzRnJvbVNlcnZlciwgdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWwpO1xuICB9XG5cbiAgdG9nZ2xlKHRvZG9Ub1RvZ2dsZSkge1xuICAgIC8vIEltcGxlbWVudCB0b2dnbGUgcm91dGluZS5cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyBVUERBVEUgVklFV1xuICAgIC8vIFNFTkQgVEhFIEVWRU5UIFRPIFNFUlZFUi5cbiAgICBhbGVydCgnQ2hlY2sgQ2xpY2tlZCcpO1xuXG4gIH1cblxuICBkaXNjYXJkKHRvZG8pIHtcbiAgICAvLyBJbXBsZW1lbnQgZGlzY2FyZCByb3V0aW5lLlxuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vIFJFTU9WRSBGUk9NIFZJRVdcbiAgICAvLyBTRU5EIFJFTU9WQUwgRVZFTlQgVE8gU0VSVkVSLlxuICAgIGFsZXJ0KCdEaXNjYXJkIENsaWNrZWQnKTtcbiAgfVxuICBcbiAgcmVuZGVyKCkge1xuICAgIHZhciB0YXNrcyA9IHRoaXMuc3RhdGUudGFza3M7XG4gICAgdmFyIHRhc2tJdGVtcyA9IHRhc2tzLm1hcChmdW5jdGlvbiAodGFzaykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRhc2tJdGVtXG4gICAgICAgICAga2V5PXt0YXNrLmlkfVxuICAgICAgICAgIHRhc2s9e3Rhc2t9XG4gICAgICAgICAgb25Ub2dnbGU9e3RoaXMudG9nZ2xlLmJpbmQodGhpcywgdGFzayl9XG4gICAgICAgICAgb25EaXNjYXJkPXt0aGlzLmRpc2NhcmQuYmluZCh0aGlzLCB0YXNrKX1cbiAgICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhc2stYm94XCI+XG4gICAgICAgIDxoMT5HaXZlIE1lIFRhc2s8L2gxPlxuICAgICAgICA8VGFza0Zvcm0gb25UYXNrU3VibWl0PXt0aGlzLmhhbmRsZVRhc2tTdWJtaXR9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFzay1saXN0XCI+XG4gICAgICAgICAge3Rhc2tJdGVtc31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUb2RvQXBwO1xuIiwiLy9pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRvZG9BcHAgZnJvbSAnLi9Ub2RvQXBwJztcblxuUmVhY3QucmVuZGVyKFxuICAgIC8vIExvYWQgZGF0YSBmcm9tIHVzZXItc3BlY2lmaWMgdGFzayBsaXN0LlxuICAgIC8vIFRoZSBnaXZlbiBkYXRhIHdpbGwgYmUgcHJvY2Vzc2VkIGFscmVhZHkuIEl0IG1lYW5zIGl0IGhhcyBuLXByb21pc2luZ1xuICAgIC8vIHRhc2tzIGZvciBjdXJyZW50IGNvbnRleHQuIEluIHZpZXcgaXQgb25seSByZW5kZXIgdGhlIGRhdGEgcHJldHR5LlxuICAgIDxUb2RvQXBwIHVybD1cInRhc2tzLmpzb25cIiBwb2xsSW50ZXJ2YWw9ezIwMDB9IC8+XG4gICAgLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuIl19
