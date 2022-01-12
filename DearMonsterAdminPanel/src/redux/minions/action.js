import axios from 'axios'
import { Minion } from '../../utilities/constant'
export const getMinions = (token) => dispatch => {
    axios
        .get(`${Minion}`, {
            // headers: {
            //     "Authorization": `${token.token}`,
            //     // crossDomain: true,
            //     // 'Access-Control-Allow-Origin': '*'
            // },
            // 'Content-Type': 'application/x-www-form-urlencoded'
        })
        .then((res) => {
            console.log('response data', res)
            // if (res.data.success) {
            // }
            return dispatch({
                type: 'GET_MINIONS',
                payload: res.data.minions
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addMinions = (data) => dispatch => {

    // if (state.email && state.password) {
    const params = new URLSearchParams()
    params.append('title', data.name)
    params.append('rating', data.rating)
    params.append('totalRating', data.totalRating)
    params.append('price', Number(data.price))
    params.append('values.Win_Rate', data.win_Rate)
    params.append('values.Reward_Estimated', data.reward_Estimated)
    params.append('values.Exp_Gain', data.exp_Gain)
    params.append('img', 'image value')
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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

export const editMinions = (data) => dispatch => {
    console.log('edit data', data)
    // return dispatch => {
    const params = new URLSearchParams()
    params.append('id', data.id)
    params.append('title', data.name)
    params.append('rating', data.rating)
    params.append('totalRating', data.totalRating)
    params.append('price', Number(data.price))
    params.append('values.Win_Rate', data.win_Rate)
    params.append('values.Reward_Estimated', data.reward_Estimated)
    params.append('values.Exp_Gain', data.exp_Gain)
    params.append('img', 'image value')
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    axios
        .put(`${Minion}`, params, config)
        .then((res) => {
            console.log('response', res)
            // return dispatch({
            //     type: 'ADD_MINIONS',
            //     payload: res.data.minion
            // })
        }).catch((e) => {
            console.log("Error", e)
        })

    // return dispatch({
    //     type: 'EDIT_MINIONS',
    //     payload: data
    // });
    // }
};

export const deleteMinions = (id) => dispatch => {
    console.log('delete id', id)
    // return dispatch => {
    axios.delete(`${Minion}/${id}`)
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



    // return dispatch({
    //     type: 'DELETE_MINIONS',
    //     payload: id
    // });

    // }
}; 