const initialstate = {
    wheelHistory: [],
    count: 0
};

const WheelHistoryReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_WHEEL_HISTORY':
            return {
                ...state,
                wheelHistory: [...action.payload.wheelHistory],
                count: action.payload.count
            }
        case 'GET_WHEEL_HISTORY_BY_WALLET':
            return {
                ...state,
                wheelHistory: [...action.payload.wheelHistory],
                count: action.payload.count
            }
        default:
            return state;
    }
};

export default WheelHistoryReducer;   