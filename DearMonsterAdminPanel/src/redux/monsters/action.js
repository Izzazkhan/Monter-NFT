import axios from 'axios'
import { Monster } from '../../utilities/constant'

export const getDearMonsters = () => dispatch => {
    axios
        .get(`${Monster}`)
        .then((res) => {
            return dispatch({
                type: 'GET_DEARMONSTERS',
                payload: res.data.monsters
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addDearMonsters = (data, token) => dispatch => {

    const params = new URLSearchParams()
    params.append('title', data.title)
    // params.append('img', data.img)
    params.append('cetagory', data.cetagory)
    params.append('totalRating', Number(data.totalRating))
    params.append('price', Number(data.price))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .post(Monster, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_DEARMONSTERS',
                payload: res.data.monster
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const editDearMonsters = (data, token) => dispatch => {

    console.log("=========")
    console.log(data)

    const params = new URLSearchParams()

    params.append('title', data.title)
    // params.append('img', data.img)
    params.append('cetagory', data.cetagory)
    params.append('totalRating', Number(data.totalRating))
    params.append('price', Number(data.price))

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .put(`${Monster}/${data._id}`, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'EDIT_DEARMONSTERS',
                payload: res.data.monster
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteDearMonsters = (id, token) => dispatch => {
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
                type: 'DELETE_DEARMONSTERS',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 