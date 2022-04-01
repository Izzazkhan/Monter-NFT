const initialstate = {
    wheelHistory: []
};

const WheelHistoryReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_WHEEL_HISTORY':
            return {
                ...state,
                wheelHistory: [...action.payload]
            }
        default:
            return state;
    }
};

export default WheelHistoryReducer;   