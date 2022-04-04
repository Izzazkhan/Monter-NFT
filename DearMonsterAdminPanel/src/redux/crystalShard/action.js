import axios from 'axios'
import { Monster, CrystalShard, Shards } from '../../utilities/constant'

export const getCrystalShard = (limit, skip) => dispatch => {
    axios
        // .get(`${Shards}?limit=${limit}&skip=${skip}`)
        .get(`${Shards}`)
        .then((res) => {
            return dispatch({
                type: 'GET_CRYSTALSHARD',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addCrystalShard = (data, token) => dispatch => {
        const params = new URLSearchParams()
        params.append('shardTypeId', data.shardType)
        params.append('shardName', data.shardName)
        params.append('shardDescription', data.shardDescription)
        
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
                "Token": `Bearer ${token.token}`
            }
        }
        axios
            .post(Shards, params, config)
            .then((res) => {
                // console.log('res.data', res.data)
                return dispatch({
                type: 'ADD_CRYSTALSHARD',
                payload: res.data
            })
            }).catch((e) => {
                console.log("Error", e)
            })
};

export const editCrystalShard = (data, token) => dispatch => {

    const params = new URLSearchParams()
        params.append('shardTypeId', data.shardType)
        params.append('shardName', data.shardName)
        params.append('shardDescription', data.shardDescription)
        
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
                "Token": `Bearer ${token.token}`
            }
        }
    axios
        .put(`${Shards}/${data._id}`, params, config)
        .then((res) => {
            return dispatch({
                type: 'EDIT_CRYSTALSHARD',
                payload: res.data.shards
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteCrystalShard = (id, token) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios.delete(`${Shards}/${id}`, config)
        .then((res) => {
            console.log('response delete', res)
            return dispatch({
                type: 'DELETE_CRYSTALSHARD',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 