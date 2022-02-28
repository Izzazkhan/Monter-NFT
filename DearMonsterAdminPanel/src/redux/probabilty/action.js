import axios from 'axios'
import { ProbilityList } from '../../utilities/constant'

export const getProbabilty = (token) => dispatch => {
    axios
        .get(`${ProbilityList}`)
        .then((res) => {
            console.log('pros res', res)
            return dispatch({
                type: 'GET_PROBABILITY',
                payload: res.data.probabiltyList
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addProbability = (numberList, token) => dispatch => {

    const params = new URLSearchParams()
        params.append('prob_1', Number(numberList.prob_1))
        params.append('prob_2', Number(numberList.prob_2))
        params.append('prob_3', Number(numberList.prob_3))
        params.append('prob_4', Number(numberList.prob_4))
        params.append('prob_5', Number(numberList.prob_5))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .post(ProbilityList, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'ADD_PROBABILITY',
                payload: res.data.probabiltyList
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const editProbability = (numberList, token) => dispatch => {
    const params = new URLSearchParams()
    params.append('prob_1', Number(numberList.prob_1))
    params.append('prob_2', Number(numberList.prob_2))
    params.append('prob_3', Number(numberList.prob_3))
    params.append('prob_4', Number(numberList.prob_4))
    params.append('prob_5', Number(numberList.prob_5))
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .put(`${ProbilityList}/${numberList._id}`, params, config)
        .then((res) => {
            console.log('response', res)
            return dispatch({
                type: 'EDIT_PROBABILITY',
                payload: res.data.probabiltyList
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteProbability = (id, token) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios.delete(`${ProbilityList}/${id}`, config)
        .then((res) => {
            console.log('response delete', res)
            return dispatch({
                type: 'DELETE_PROBABILITY',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 