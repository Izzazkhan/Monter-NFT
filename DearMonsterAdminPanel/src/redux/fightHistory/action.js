import axios from 'axios'
import { FightHistory } from '../../utilities/constant'

export const getWithdrawRequest = () => dispatch => {
    axios
        .get(`${FightHistory}`)
        .then((res) => {
            return dispatch({
                type: 'GET_FIGHT_HISTORY',
                payload: res.data.fightLog
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}


