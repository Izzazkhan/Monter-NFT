import { applyMiddleware, createStore } from 'redux';
import { combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './reducers/authReducer';
import { tradeItems } from "./reducers/tradeItem"

const initialState = {
	isAuthenticated: false,
	loading: false,
	tradeItems: null,
	error: '',
	userId: '',
	balance: 0,
};
const rootReducer = combineReducers({
	auth: authReducer,
});

const store = createStore(rootReducer, initialState, compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
	window.__REDUX_DEVTOOLS_EXTENSION__({
		name: "app", instanceId: "app"
	})
));

export default store;
