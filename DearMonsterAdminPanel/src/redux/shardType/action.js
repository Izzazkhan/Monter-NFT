import axios from 'axios'
import { ShardType } from '../../utilities/constant'

export const getShardType = (limit, skip) => dispatch => {
    axios
        .get(`${ShardType}?limit=${limit}&skip=${skip}`)
        .then((res) => {
            return dispatch({
                type: 'GET_SHARD_TYPE',
                payload: res.data
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

export const addShardType = (data, imageUpload, token) => dispatch => {

        let formData = new FormData();
        if (imageUpload) {
            formData.append("image", imageUpload, imageUpload.name);
        }
        const params = {
            image: data.image,
            typeName: data.typeName
        }
        formData.append("data", JSON.stringify(params))
        
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
                "Token": `Bearer ${token.token}`
            }
        }
        axios
            .post(ShardType, formData, config)
            .then((res) => {
                return dispatch({
                type: 'ADD_SHARD_TYPE',
                payload: res.data.shardType
            })
            }).catch((e) => {
                console.log("Error", e)
            })
};

export const editShardType = (data, imageUpload, token) => dispatch => {

    let formData = new FormData();
    if (imageUpload) {
        formData.append("image", imageUpload, imageUpload.name);
    }
    const params = {
        image: data.image,
        typeName: data.typeName
    }
    formData.append("data", JSON.stringify(params))
    
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios
        .put(`${ShardType}/${data._id}`, formData, config)
        .then((res) => {
            return dispatch({
                type: 'EDIT_SHARD_TYPE',
                payload: res.data.shardType
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

export const deleteShardType = (id, token) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
            "Token": `Bearer ${token.token}`
        }
    }
    axios.delete(`${ShardType}/${id}`, config)
        .then((res) => {
            console.log('response delete', res)
            return dispatch({
                type: 'DELETE_SHARD_TYPE',
                payload: id
            });
        })
        .catch((e) => {
            console.log("error: ", e);
        });

}; 