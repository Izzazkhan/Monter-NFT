import axios from 'axios'
import { SpinCost } from '../../utilities/constant'

export const getSpinCost = (token) => dispatch => {
    axios
        .get(`${SpinCost}`)
        .then((res) => {
            console.log('pros res', res)
            return dispatch({
                type: 'GET_SPIN_COST',
                payload: res.data.spinCost
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addSpinCost = (numberList, token) => dispatch => {

    const params = new URLSearchParams()
        params.append('spin_1_cost', Number(numberList.spin_1_cost))
        params.append('spin_5_cost', Number(numberList.spin_5_cost))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .post(SpinCost, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_SPIN_COST',
                payload: res.data.spinCost
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const editSpinCost = (numberList, token) => dispatch => {
    const params = new URLSearchParams()
    params.append('spin_1_cost', Number(numberList.spin_1_cost))
    params.append('spin_5_cost', Number(numberList.spin_5_cost))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .put(`${SpinCost}/${numberList._id}`, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'EDIT_SPIN_COST',
                payload: res.data.spinCost
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteSpinCost = (id, token) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios.delete(`${SpinCost}/${id}`, config)
        .then((res) => {
            console.log('response delete', res)
            return dispatch({
                type: 'DELETE_SPIN_COST',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 