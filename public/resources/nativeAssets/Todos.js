(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoItem = (function (_React$Component) {
	_inherits(TodoItem, _React$Component);

	function TodoItem() {
		_classCallCheck(this, TodoItem);

		_get(Object.getPrototypeOf(TodoItem.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(TodoItem, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				this.props.todo.text
			);
		}
	}]);

	return TodoItem;
})(React.Component);

;

// TodoItem.propTypes = {
// 	todo: React.PropTypes.shape({
// 	  text: React.PropTypes.string.isRequired
// 	})
// };

exports["default"] = TodoItem;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _TodoItem = require('./TodoItem');

var _TodoItem2 = _interopRequireDefault(_TodoItem);

var TodoList = React.createClass({
  displayName: "TodoList",

  getInitialState: function getInitialState() {
    return {
      todos: [{ id: 1, text: "advent calendar1" }, { id: 2, text: "advent calendar2" }, { id: 3, text: "advent calendar3" }]
    };
  },
  render: function render() {
    var todos = this.state.todos.map(function (todo) {
      return React.createElement(
        "li",
        { key: todo.id },
        React.createElement(_TodoItem2["default"], { todo: todo })
      );
    });
    return React.createElement(
      "ul",
      null,
      todos
    );
  }
});

exports["default"] = TodoList;
module.exports = exports["default"];

},{"./TodoItem":1}],3:[function(require,module,exports){
//import React from 'react';
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _TodoList = require('./TodoList');

var _TodoList2 = _interopRequireDefault(_TodoList);

React.render(
// Load data from user-specific task list.
// The given data will be processed already. It means it has n-promising
// tasks for current context. In view it only render the data pretty.
React.createElement(_TodoList2['default'], null), document.getElementById('content'));

},{"./TodoList":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaWxqaWNob2kvc3dtYWVzdHJvL3N0ZXAxX2xldmVsMi9naXZlbWV0YXNrL3NyYy9mcm9udGVuZC90b2RvL1RvZG9JdGVtLmpzeCIsIi9Vc2Vycy9pbGppY2hvaS9zd21hZXN0cm8vc3RlcDFfbGV2ZWwyL2dpdmVtZXRhc2svc3JjL2Zyb250ZW5kL3RvZG8vVG9kb0xpc3QuanN4IiwiL1VzZXJzL2lsamljaG9pL3N3bWFlc3Ryby9zdGVwMV9sZXZlbDIvZ2l2ZW1ldGFzay9zcmMvZnJvbnRlbmQvdG9kby9pbmRleC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztJQ0FNLFFBQVE7V0FBUixRQUFROztVQUFSLFFBQVE7d0JBQVIsUUFBUTs7NkJBQVIsUUFBUTs7O2NBQVIsUUFBUTs7U0FDUCxrQkFBRTtBQUNQLFVBQ0M7OztJQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7SUFDaEIsQ0FDTDtHQUNGOzs7UUFQSSxRQUFRO0dBQVMsS0FBSyxDQUFDLFNBQVM7O0FBUXJDLENBQUM7Ozs7Ozs7O3FCQVFhLFFBQVE7Ozs7Ozs7Ozs7Ozt3QkNoQkYsWUFBWTs7OztBQUVqQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDL0IsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsV0FBSyxFQUFFLENBQ0wsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxrQkFBa0IsRUFBQyxFQUMvQixFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFDLGtCQUFrQixFQUFDLEVBQy9CLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUMsa0JBQWtCLEVBQUMsQ0FDaEM7S0FDRixDQUFDO0dBQ0g7QUFDRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDekMsYUFBUTs7VUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQUFBQztRQUN2Qiw2Q0FBVSxJQUFJLEVBQUUsSUFBSSxBQUFDLEdBQUU7T0FDcEIsQ0FBRTtLQUNSLENBQUMsQ0FBQztBQUNILFdBQU87OztNQUFLLEtBQUs7S0FBTSxDQUFDO0dBQ3pCO0NBQ0YsQ0FBQyxDQUFDOztxQkFFWSxRQUFROzs7Ozs7Ozs7d0JDckJGLFlBQVk7Ozs7QUFFakMsS0FBSyxDQUFDLE1BQU07Ozs7QUFJUixnREFBVyxFQUNULFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQ3ZDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgVG9kb0l0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XG5cdHJlbmRlcigpe1xuXHRcdHJldHVybihcblx0XHRcdDxkaXY+XG5cdFx0XHRcdHt0aGlzLnByb3BzLnRvZG8udGV4dH1cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn07XG5cbi8vIFRvZG9JdGVtLnByb3BUeXBlcyA9IHtcbi8vIFx0dG9kbzogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbi8vIFx0ICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbi8vIFx0fSlcbi8vIH07XG5cbmV4cG9ydCBkZWZhdWx0IFRvZG9JdGVtO1xuIiwiaW1wb3J0IFRvZG9JdGVtIGZyb20gJy4vVG9kb0l0ZW0nO1xuXG52YXIgVG9kb0xpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9kb3M6IFtcbiAgICAgICAge2lkOjEsIHRleHQ6XCJhZHZlbnQgY2FsZW5kYXIxXCJ9LFxuICAgICAgICB7aWQ6MiwgdGV4dDpcImFkdmVudCBjYWxlbmRhcjJcIn0sXG4gICAgICAgIHtpZDozLCB0ZXh0OlwiYWR2ZW50IGNhbGVuZGFyM1wifVxuICAgICAgXVxuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgdG9kb3MgPSB0aGlzLnN0YXRlLnRvZG9zLm1hcCgodG9kbykgPT4ge1xuICAgICAgcmV0dXJuICg8bGkga2V5PXt0b2RvLmlkfT5cbiAgICAgICAgPFRvZG9JdGVtIHRvZG89e3RvZG99Lz5cbiAgICAgIDwvbGk+KTtcbiAgICB9KTtcbiAgICByZXR1cm4gPHVsPnt0b2Rvc308L3VsPjtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRvZG9MaXN0O1xuIiwiLy9pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRvZG9MaXN0IGZyb20gJy4vVG9kb0xpc3QnO1xuXG5SZWFjdC5yZW5kZXIoXG4gICAgLy8gTG9hZCBkYXRhIGZyb20gdXNlci1zcGVjaWZpYyB0YXNrIGxpc3QuXG4gICAgLy8gVGhlIGdpdmVuIGRhdGEgd2lsbCBiZSBwcm9jZXNzZWQgYWxyZWFkeS4gSXQgbWVhbnMgaXQgaGFzIG4tcHJvbWlzaW5nXG4gICAgLy8gdGFza3MgZm9yIGN1cnJlbnQgY29udGV4dC4gSW4gdmlldyBpdCBvbmx5IHJlbmRlciB0aGUgZGF0YSBwcmV0dHkuXG4gICAgPFRvZG9MaXN0Lz5cbiAgICAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jylcbik7XG4iXX0=
