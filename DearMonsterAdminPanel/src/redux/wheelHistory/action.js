import axios from 'axios'
import { WheelHistoryAPI } from '../../utilities/constant'

export const getWheelHistory = (limit, skip) => dispatch => {
    axios
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

export const getWheelHistoryByWallet = (walletAddress,limit, skip) => dispatch => {
    axios
        .get(`${WheelHistoryAPI}/rewardGainByUser/${walletAddress}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_WHEEL_HISTORY_BY_WALLET',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}