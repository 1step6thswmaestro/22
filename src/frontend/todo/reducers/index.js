import { combineReducers } from 'redux';
import { reducer as taskReducer} from '../actions/tasks_decl'
import { reducer as taskLogReducer} from '../actions/tasklog_decl'


const rootReducer = combineReducers({
	tasks: taskReducer
	, tasklog: taskLogReducer
});

export default rootReducer;