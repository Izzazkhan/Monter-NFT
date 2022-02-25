import axios from 'axios'
import { WithdrawRequest } from '../../utilities/constant'

export const getWithdrawRequest = () => dispatch => {
    axios
        .get(`${WithdrawRequest}`)
        .then((res) => {
            console.log('with draw request', res)
            return dispatch({
                type: 'GET_WITHDRAW_REQUEST',
                payload: res.data.withdrawRequest
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}


export const markResolved = (id, type, transactionHash) => dispatch => {
    const params = new URLSearchParams()
    params.append('isResolved', true)
    params.append('transactionHash', transactionHash)

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
        }
    }
    axios
        .put(`${WithdrawRequest}/${id}/${type}`, params, config)
        .then((res) => {
            return dispatch({
                type: 'MARK_RESOLVED',
                payload: res.data.withdrawRequest
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

