import axios from 'axios'
import { WheelHistory } from '../../utilities/constant'

export const getWheelHistory = () => dispatch => {
    axios
        .get(`${WheelHistory}`)
        .then((res) => {
            return dispatch({
                type: 'GET_WHEEL_HISTORY',
                payload: res.data.wheelHistory
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}


