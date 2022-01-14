import { TRADE_ITEMS } from '../types';
import axios from 'axios'

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: '',
    userId: '',
    balance: 0,
    tradeItems: null
};

export const tradeItems = (state = initialState, action) => {
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