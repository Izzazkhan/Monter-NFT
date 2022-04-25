import axios from 'axios'
import { WheelHistoryAPI } from '../../utilities/constant'

export const getWheelHistory = (limit, skip) => dispatch => {
    axios
        // .get(`${WheelHistory}`)
        .get(`${WheelHistoryAPI}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_WHEEL_HISTORY',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}

export const getWheelHistoryByWallet = (limit, skip) => dispatch => {
    axios
        // .get(`${WheelHistory}`)
        .get(`${WheelHistoryAPI}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_WHEEL_HISTORY',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}


