import { combineReducers } from 'redux';
import { reducer as taskReducer} from '../actions/tasks_decl'
import { reducer as taskLogReducer} from '../actions/tasklog_decl'
import { reducer as globalReducer} from '../actions/global_decl'


const rootReducer = combineReducers({
	tasks: taskReducer
	, tasklog: taskLogReducer
	, global: globalReducer
});

export default rootReducer;