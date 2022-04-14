import axios from 'axios'
import { Monster, FortuneWheel } from '../../utilities/constant'

export const getFortuneWheel = (limit, skip) => dispatch => {
    axios
        .get(`${FortuneWheel}`)
        .then((res) => {
            return dispatch({
                type: 'GET_FORTUNE_WHEEL',
                payload: res.data.fortuneWheel
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addFortuneWheel = (data, token) => dispatch => {

    const params = new URLSearchParams()
    params.append('isActive', data.isActive)
    params.append('wheelName', data.wheelName)
    params.append('slots', JSON.stringify(data.slots))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .post(FortuneWheel, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_FORTUNE_WHEEL',
                payload: res.data.fortuneWheel
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const editFortuneWheel = (data, token) => dispatch => {

    const params = new URLSearchParams()
    params.append('isActive', data.isActive)
    params.append('wheelName', data.wheelName)
    params.append('slots', JSON.stringify(data.slots))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .put(`${FortuneWheel}/${data._id}`, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'EDIT_FORTUNE_WHEEL',
                payload: res.data.fortuneWheel
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteFortuneWheel = (id, token) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios.delete(`${Monster}/${id}`, config)
        .then((res) => {
            console.log('response delete', res)
            return dispatch({
                type: 'DELETE_FORTUNE_WHEEL',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 