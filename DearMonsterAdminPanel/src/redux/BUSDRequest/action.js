import axios from 'axios'
import { BUSDRequest, RequestByWallet } from '../../utilities/constant'

export const getBUSDRequest = (limit, skip) => dispatch => {
    axios
        .get(`${BUSDRequest}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_BUSD_REQUEST',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
}

export const getBUSDRequestByWallet = (walletAddress, limit, skip) => dispatch => {
    if(walletAddress != '') {
        axios
            .get(`${RequestByWallet}/${walletAddress}?limit=${limit}&skip=${skip}`)
            .then((res) => {
                return dispatch({
                    type: 'GET_BUSD_REQUEST_BY_WALLET',
                    payload: res.data
                })
            })
            .catch((e) => {
                console.log("error: ", e);
            })
    } else {
        return dispatch({
            type: 'GET_EMPTY_BUSD_REQUEST'
        })
    }
}


export const markResolved = (id) => dispatch => {
    const params = new URLSearchParams()
    params.append('isResolved', true)

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
        }
    }
    axios
        .put(`${BUSDRequest}/${id}`, params, config)
        .then((res) => {
            console.log('responseeeeeeee', res)
            return dispatch({
                type: 'MARK_RESOLVED',
                payload: res.data.BUSDRequest_
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

