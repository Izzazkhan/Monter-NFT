import axios from 'axios'
import { WithdrawRequest, RequestByWallet } from '../../utilities/constant'

export const getWithdrawRequest = (limit, skip) => dispatch => {
    axios
        .get(`${WithdrawRequest}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_WITHDRAW_REQUEST',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}

export const getWithdrawRequestByWallet = (walletAddress, limit, skip) => dispatch => {
    if(walletAddress != '') {
        axios
            .get(`${RequestByWallet}/${walletAddress}?limit=${limit}&skip=${skip}`)
            .then((res) => {
                return dispatch({
                    type: 'GET_WITHDRAW_REQUEST_BY_WALLET',
                    payload: res.data
                })
            })
            .catch((e) => {
                console.log("error: ", e);
            })
    } else {
        return dispatch({
            type: 'GET_EMPTY_WITHDRAW_REQUEST'
        })
    }
}


export const markResolved = (id, transactionHash) => dispatch => {
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
        .put(`${WithdrawRequest}/${id}`, params, config)
        .then((res) => {
            return dispatch({
                type: 'MARK_RESOLVED',
                payload: res.data.withdrawRequest
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

