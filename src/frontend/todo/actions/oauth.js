'use strict'

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
const CLIENT_ID = '199263260413-d9la67nokq2873broqrrm90k342mo98b.apps.googleusercontent.com';

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

var gapi = null;
var isAuthorized = false;

export function isAuthed() {
	return isAuthorized;
}

export function setApi(_gapi) {
	gapi = _gapi;
}

/**
 * Check if current user has authorized this application.
 */
export function checkAuth() {
	gapi.auth.authorize(
		{
			'client_id': CLIENT_ID,
			'scope': SCOPES.join(' '),
			'immediate': true
		}, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
export function handleAuthResult(authResult) {
	var authorizeDiv = document.getElementById('authorize-div');
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		authorizeDiv.style.display = 'none';
		loadCalendarApi();
	} else {
		// Show auth UI, allowing the user to initiate authorization by
		// clicking authorize button.
		authorizeDiv.style.display = 'inline';
	}
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
export function handleAuthClick(event) {
	if (gapi) {
		isAuthorized = true;
		gapi.auth.authorize(
			{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
			handleAuthResult);
	}
	return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
export function loadCalendarApi() {
	gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
export function listUpcomingEvents() {
	gapi.client.calendar.calendarList.list({
		'fields': 'items(description,etag,id,primary,summary)'
	})
	.then(function(response){
		console.log(response.result);
		response.result.items.map(function(calendar){
			var request = gapi.client.calendar.events.list({
				'calendarId': calendar.id,
				'timeMin': (new Date()).toISOString(),
				'showDeleted': false,
				'singleEvents': true,
				'maxResults': 10,
				'orderBy': 'startTime'
			});

			/**
			 *  SHOULD CHANGE HERE!!!
			 *  TODO: Change here to push loaded events to the database.
			 */
			request.execute(function(resp) {
				var events = resp.items;

				if (events.length > 0) {
					for (var i = 0; i < events.length; i++) {
						var event = events[i];
						var when = event.start.dateTime;
						if (!when) {
							when = event.start.date;
						}
						appendPre(event.summary + ' (' + when + ')')
					}
				} else {
					appendPre('No upcoming events found.');
				}
			});
		})
	}, function(reason) {
		console.log(reason);
	});
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
export function appendPre(message) {
	var pre = document.getElementById('output');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}