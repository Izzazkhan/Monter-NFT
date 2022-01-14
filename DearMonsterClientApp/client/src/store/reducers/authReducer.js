// create a reducer for login
import { TRADE_ITEMS } from '../types';

const initialState = {
	isAuthenticated: false,
	tradeItems: null,
	loading: false,
	error: '',
	userId: '',
	balance: 0,
};

export const authReducer = (state = initialState, action) => {
	switch (action.type) {

		case TRADE_ITEMS:
			return {
				...state,
				isAuthenticated: true,
				tradeItems: action.payload,
				loading: false,
			};

		default:
			return state;
	}
};
