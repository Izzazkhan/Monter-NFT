const initialstate = {
    BUSDRequest: [],
    count: 0
};

const BUSDRequestReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_BUSD_REQUEST':
            return {
                ...state,
                BUSDRequest: [...action.payload.BUSDRequest_],
                count: action.payload.count
            }
        case 'GET_BUSD_REQUEST_BY_WALLET':
            return {
                ...state,
                BUSDRequest: [...action.payload.BUSDRequest_],
                count: action.payload.count
            }
        case 'GET_EMPTY_BUSD_REQUEST':
            return {
                ...state,
                BUSDRequest: [],
                count: 0
            }
        
        case 'MARK_RESOLVED':
            return {
                ...state,
                BUSDRequest: state.BUSDRequest.map(
                    (content, i) => content._id === action.payload._id ? {
                        ...content, isResolved: action.payload.isResolved
                    }
                        : content)
            };
        default:
            return state;
    }
};

export default BUSDRequestReducer;   