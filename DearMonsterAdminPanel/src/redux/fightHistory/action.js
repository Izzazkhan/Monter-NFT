import axios from 'axios'
import { FightHistory } from '../../utilities/constant'

export const getWithdrawRequest = (limit, skip) => dispatch => {
    axios
        .get(`${FightHistory}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_FIGHT_HISTORY',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}

export const getFigthHistoryBySearch = (type, limit, skip) => dispatch => {
    axios
        .get(`${FightHistory}/${type}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            console.log('responsssssss', res)
            return dispatch({
                type: 'GET_FIGHT_HISTORY_BY_SEARCH',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}
