import axios from 'axios'
import { Minion } from '../../utilities/constant'

export const getMinions = (token) => dispatch => {
    axios
        .get(`${Minion}`)
        .then((res) => {
            return dispatch({
                type: 'GET_MINIONS',
                payload: res.data.minions
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addMinions = (data, token) => dispatch => {

    // if (state.email && state.password) {
    const params = new URLSearchParams()
    params.append('title', data.title)
    params.append('img', data.img)
    params.append('rating', Number(data.rating))
    params.append('totalRating', Number(data.totalRating))
    params.append('price', Number(data.price))
    params.append('values.Win_Rate', Number(data.Win_Rate))
    params.append('values.Lose_Exp_Gain', Number(data.Lose_Exp_Gain))
    params.append('values.Reward_Estimated', JSON.stringify(data.Reward_Estimated))
    params.append('values.Exp_Gain', Number(data.Exp_Gain))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .post(Minion, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_MINIONS',
                payload: res.data.minion
            })
        }).catch((e) => {
            console.log("Error", e)
        })

    // } else {
    //     alert('Enter Login Details.');
    // }
};

export const editMinions = (data, token) => dispatch => {
    // return dispatch => {
    const params = new URLSearchParams()

    params.append('title', data.title)
    // params.append('img', data.img)
    params.append('rating', Number(data.rating))
    params.append('totalRating', Number(data.totalRating))
    params.append('price', Number(data.price))
    params.append('values.Win_Rate', Number(data.Win_Rate))
    params.append('values.Win_Rate_Display', data.Win_Rate_Display)
    params.append('values.Lose_Exp_Gain', Number(data.Lose_Exp_Gain))
    params.append('values.Reward_Estimated', JSON.stringify(data.Reward_Estimated))
    params.append('values.Exp_Gain', Number(data.Exp_Gain))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .put(`${Minion}/${data._id}`, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'EDIT_MINIONS',
                payload: res.data.minion
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteMinions = (id, token) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios.delete(`${Minion}/${id}`, config)
        .then((res) => {
            console.log('response delete', res)
            // if (res.data.success) {

            // // } else if (!res.data.success) {

            // }
            // return res;
            return dispatch({
                type: 'DELETE_MINIONS',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 