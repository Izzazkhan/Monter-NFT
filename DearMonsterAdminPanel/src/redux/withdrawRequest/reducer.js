const initialstate = {
    withdrawRequests: [],
    count: 0
};

const WithdrawRequestReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_WITHDRAW_REQUEST':
            return {
                ...state,
                withdrawRequests: [...action.payload.withdrawRequest],
                count: action.payload.count
            }
        case 'GET_WITHDRAW_REQUEST_BY_WALLET':
            return {
                ...state,
                withdrawRequests: [...action.payload.withdrawRequest],
                count: action.payload.count
            }
        case 'GET_EMPTY_WITHDRAW_REQUEST':
            return {
                ...state,
                withdrawRequests: [],
                count: 0
            }
        
        case 'MARK_RESOLVED':
            return {
                ...state,
                withdrawRequests: state.withdrawRequests.map(
                    (content, i) => content._id === action.payload._id ? {
                        ...content, isResolved: action.payload.isResolved
                    }
                        : content)
            };
        default:
            return state;
    }
};

export default WithdrawRequestReducer;   