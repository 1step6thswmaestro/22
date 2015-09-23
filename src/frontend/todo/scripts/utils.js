var app = app || {};

(function () {
	'use strict';

	app.Utils = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
					.toString(16);
			}

			return uuid;
		},

		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},

		store: function (namespace, object, data) {
			// store retrieved data into object. Use object.setData() to do such job.


			// Resolve Access URL per each user with given namespace.
			// For now, we use just tasks.json file for demonstration.
			var dbHandleURL = '/tasks.json';
			if (data) {
				// Sending json data that contains key and list of tasks.
				$.ajax({
	        url: dbHandleURL,
	        dataType: 'json',
	        type: 'POST',
	        data: task,
	        success: function(data) {
						object.setData(data);
	        }.bind(this),
	        error: function(xhr, status, err) {
	          // console.error(this.props.url, status, err.toString());
	        }.bind(this)
	      });
				return 0;
			}
			// Expecting json data that contains list of tasks.
      $.ajax({
        url: dbHandleURL,
        dataType: 'json',
        cache: false,
        success: function(data) {
					object.setData(data);
        }.bind(this),
        error: function(xhr, status, err) {
          // console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
		},

		extend: function () {
			var newObj = {};
			for (var i = 0; i < arguments.length; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
			}
			return newObj;
		}
	};
})();
