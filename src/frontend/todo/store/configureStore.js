import rootReducer from '../reducers';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

export function configureStore(initialState){
	let createStoreWithMiddleware = applyMiddleware(
		thunkMiddleware
	)(createStore);

	console.log('initialState : ', initialState);
	let store = createStoreWithMiddleware(rootReducer, initialState);
	store.dispatch({type: 'test'})
	return store;
}