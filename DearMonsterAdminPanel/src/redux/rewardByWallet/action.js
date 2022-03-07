import axios from 'axios'
import { RewardByWallet } from '../../utilities/constant'

export const getRewardByWallet = (walletAddress) => dispatch => {
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


