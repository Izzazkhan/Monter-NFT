import axios from 'axios'
import { Monster, CrystalShard } from '../../utilities/constant'

export const getCrystalShard = (limit, skip) => dispatch => {
    axios
        .get(`${CrystalShard}?limit=${limit}&skip=${skip}`)
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

export const addCrystalShard = (data, imageUpload, token) => dispatch => {

        let formData = new FormData();
        if (imageUpload) {
            formData.append("crystalImage", imageUpload, imageUpload.name);
        }
        const params = {
            crystalImage: data.crystalImage,
            name: data.name,
            description: data.description
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
            .post(CrystalShard, formData, config)
            .then((res) => {
                return dispatch({
                type: 'ADD_CRYSTALSHARD',
                payload: res.data.cystalShard
            })
            }).catch((e) => {
                console.log("Error", e)
            })
};

export const editCrystalShard = (data, imageUpload, token) => dispatch => {

    let formData = new FormData();
    if (imageUpload) {
        formData.append("crystalImage", imageUpload, imageUpload.name);
    }
    const params = {
        crystalImage: data.crystalImage,
        name: data.name,
        description: data.description
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
        .put(`${CrystalShard}/${data._id}`, formData, config)
        .then((res) => {
            return dispatch({
                type: 'EDIT_CRYSTALSHARD',
                payload: res.data.cystalShard
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
    axios.delete(`${CrystalShard}/${id}`, config)
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