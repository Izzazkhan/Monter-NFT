const initialstate = {
    rewardByWallet: []
};

const RewardByWalletReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_REWARD_BY_WALLET':
            console.log('bbbbbbbbbbbbbb', {
                ...state,
                rewardByWallet: [...action.payload]
            })
            return {
                ...state,
                rewardByWallet: [...action.payload]
            }
        default:
            return state;
    }
};

export default RewardByWalletReducer;   