const initialstate = {
    fightHistory: []
};

const WithdrawRequestReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_FIGHT_HISTORY':
            return {
                ...state,
                fightHistory: [...action.payload]
            }
        default:
            return state;
    }
};

export default WithdrawRequestReducer;   