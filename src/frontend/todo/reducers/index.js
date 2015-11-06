import { combineReducers } from 'redux';
import { reducer as taskReducer } from '../actions/tasks_decl'
import { reducer as taskLogReducer } from '../actions/tasklog_decl'
import { reducer as globalReducer } from '../actions/global_decl'
import { reducer as configReducer } from '../actions/config_decl'
import { reducer as userReducer } from '../actions/user_decl'
import { reducer as googleReducer } from '../actions/thirdparty/google.decl'
import { reducer as eventsReducer } from '../actions/events.decl'
import { reducer as timetableReducer } from '../actions/timetable.decl'


const rootReducer = combineReducers({
	tasks: taskReducer
	, tasklog: taskLogReducer
	, global: globalReducer
	, config: configReducer
	, user: userReducer
	, thirdparty: combineReducers({
		google: googleReducer
	})
	, events: eventsReducer
	, timetable: timetableReducer
});

export default rootReducer;