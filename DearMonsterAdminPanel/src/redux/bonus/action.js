import axios from 'axios'
import { Bonus } from '../../utilities/constant'

export const getBonus = () => dispatch => {
    axios
        .get(`${Bonus}`)
        .then((res) => {
            return dispatch({
                type: 'GET_BONUS',
                payload: res.data.levelBonus
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addBonus = (data) => dispatch => {
    // if (state.email && state.password) {
    const params = new URLSearchParams()
    params.append('1', Number(data['1']))
    params.append('2', Number(data['2']))
    params.append('3', Number(data['3']))
    params.append('4', Number(data['4']))
    params.append('5', Number(data['5']))
    params.append('6', Number(data['6']))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    axios
        .post(Bonus, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_BONUS',
                payload: res.data.levelBonus
            })
        }).catch((e) => {
            console.log("Error", e)
        })

    // } else {
    //     alert('Enter Login Details.');
    // }
};

export const editBonus = (data) => dispatch => {
    const params = new URLSearchParams()
    params.append('1', Number(data['1']))
    params.append('2', Number(data['2']))
    params.append('3', Number(data['3']))
    params.append('4', Number(data['4']))
    params.append('5', Number(data['5']))
    params.append('6', Number(data['6']))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    axios
        .put(`${Bonus}/${data._id}`, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_BONUS',
                payload: res.data.levelBonus
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteBonus = (id) => dispatch => {
    axios.delete(`${Bonus}/${id}`)
        .then((res) => {
            console.log('response delete', res)
            // if (res.data.success) {

            // // } else if (!res.data.success) {

            // }
            // return res;
            return dispatch({
                type: 'DELETE_BONUS',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 