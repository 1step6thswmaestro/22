import { combineReducers } from 'redux';
import { reducer as taskReducer} from '../actions/tasks_decl'


const rootReducer = combineReducers({
	tasks: taskReducer
});

export default rootReducer;