const initialstate = {
    fightHistory: [],
    count: 0
};

const WithdrawRequestReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_FIGHT_HISTORY':
            return {
                ...state,
                fightHistory: [...action.payload.fightLog],
                count: action.payload.count
            }
        case 'GET_FIGHT_HISTORY_BY_SEARCH':
            return {
                ...state,
                fightHistory: [...action.payload.fightLog],
                count: action.payload.count
            }
        default:
            return state;
    }
};





export default WithdrawRequestReducer;   