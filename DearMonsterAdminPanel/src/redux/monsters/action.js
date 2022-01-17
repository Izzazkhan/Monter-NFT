import axios from 'axios'
import { Monster } from '../../utilities/constant'

export const getDearMonsters = () => dispatch => {
    axios
        .get(`${Monster}`, {
            // headers: {
            //     "Authorization": `${token.token}`,
            //     // crossDomain: true,
            //     // 'Access-Control-Allow-Origin': '*'
            // },
            // 'Content-Type': 'application/x-www-form-urlencoded'
        })
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

export const addDearMonsters = (data) => dispatch => {

    const params = new URLSearchParams()
    params.append('title', data.title)
    params.append('img', data.img)
    params.append('cetagory', data.cetagory)
    params.append('totalRating', Number(data.totalRating))
    params.append('price', Number(data.price))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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

export const editDearMonsters = (data) => dispatch => {

    console.log("=========")
    console.log(data)

    const params = new URLSearchParams()

    params.append('title', data.title)
    params.append('img', data.img)
    params.append('cetagory', data.cetagory)
    params.append('totalRating', Number(data.totalRating))
    params.append('price', Number(data.price))

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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

export const deleteDearMonsters = (id) => dispatch => {

    
    axios.delete(`${Monster}/${id}`)
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