import axios from 'axios'
import { WithdrawRequest } from '../../utilities/constant'

export const getWithdrawRequest = (token) => dispatch => {
    axios
        .get(`${WithdrawRequest}`)
        .then((res) => {
            console.log('with draw request', res)
            return dispatch({
                type: 'GET_WITHDRAW_REQUEST',
                payload: res.data.withdrawRequest
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
};

// export const markResolved = (id) => dispatch => {
//     axios.delete(`${Minion}/${id}`)
//         .then((res) => {
//             console.log('response delete', res)
//             // if (res.data.success) {

//             // // } else if (!res.data.success) {

//             // }
//             // return res;
//             return dispatch({
//                 type: 'MARK_RESOLVED',
//                 payload: id
//             });
//         })
//         .catch((e) => {
//             console.log("error: ", e);
//         });

// }; 

// export const addMinions = (data) => dispatch => {

//     // if (state.email && state.password) {
//     const params = new URLSearchParams()
//     params.append('title', data.title)
//     params.append('img', data.img)
//     params.append('rating', Number(data.rating))
//     params.append('totalRating', Number(data.totalRating))
//     params.append('price', Number(data.price))
//     params.append('values.Win_Rate', Number(data.Win_Rate))
//     params.append('values.Reward_Estimated', Number(data.Reward_Estimated))
//     params.append('values.Exp_Gain', Number(data.Exp_Gain))
//     const config = {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     }
//     axios
//         .post(Minion, params, config)
//         .then((res) => {
//             console.log('response', res)
//             return dispatch({
//                 type: 'ADD_MINIONS',
//                 payload: res.data.minion
//             })
//         }).catch((e) => {
//             console.log("Error", e)
//         })

//     // } else {
//     //     alert('Enter Login Details.');
//     // }
// };

export const markResolved = (id) => dispatch => {
    const params = new URLSearchParams()
    params.append('isResolved', false)
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    axios
        .put(`${WithdrawRequest}/${id}`, params, config)
        .then((res) => {
            return dispatch({
                type: 'MARK_RESOLVED',
                payload: res.data.withdrawRequest
            })
        }).catch((e) => {
            console.log("Error", e)
        })
};

