import axios from 'axios'
import { RewardByWallet } from '../../utilities/constant'

export const getRewardByWallet = (walletAddress) => dispatch => {
    if(walletAddress != '') {
        axios
        .get(`${RewardByWallet}/${walletAddress}`)
        .then((res) => {
            return dispatch({
                type: 'GET_REWARD_BY_WALLET',
                payload: res.data.rewardByWallet
            })
        })
        .catch((e) => {
            console.log("error: ", e);
        })
    }
    else {
        return dispatch({
            type: 'GET_REWARD_BY_WALLET',
            payload: []
        })
    }
   
}


