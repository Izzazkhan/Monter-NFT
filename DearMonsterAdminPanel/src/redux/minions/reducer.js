const initialstate = {
    minions: []
};

const MinionReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_MINIONS':
            return {
                ...state,
                minions: [...action.payload]
            }
        case 'ADD_MINIONS':
            return {
                ...state,
                minions: state.minions.concat(action.payload)
            };
        case 'EDIT_MINIONS':
            return {
                ...state,
                minions: state.minions.map(
                    (content, i) => content._id === action.payload._id ? {
                        ...content, title: action.payload.title, rating: action.payload.rating
                        , totalRating: action.payload.totalRating, values: {
                            ...content.values, Win_Rate: action.payload.values.Win_Rate,
                            Lose_Exp_Gain: action.payload.values.Lose_Exp_Gain, Exp_Gain: action.payload.values.Exp_Gain,
                            Reward_Estimated: {...JSON.parse(content.values.Reward_Estimated), 1: JSON.parse(action.payload.values.Reward_Estimated)['1'],
                            2: JSON.parse(action.payload.values.Reward_Estimated)['2'], 3: JSON.parse(action.payload.values.Reward_Estimated)['3'],
                            4: JSON.parse(action.payload.values.Reward_Estimated)['4'], 5: JSON.parse(action.payload.values.Reward_Estimated)['5']}

                        }
                    }
                        // img: action.payload.img
                        : content)
            };
        case 'DELETE_MINIONS':
            return {
                ...state,
                minions: state.minions.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default MinionReducer;   