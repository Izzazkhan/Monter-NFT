const initialstate = {
    withdrawRequests: []
};

const WithdrawRequestReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_WITHDRAW_REQUEST':
            return {
                ...state,
                withdrawRequests: [...action.payload]
            }
        // case 'ADD_MINIONS':
        //     return {
        //         ...state,
        //         minions: state.minions.concat(action.payload)
        //     };
        // case 'EDIT_MINIONS':
        //     return {
        //         ...state,
        // minions: state.minions.map(
        //     (content, i) => content.id === action.payload.id ? {
        //         ...content, name: action.payload.name, element: action.payload.element
        //         , level: action.payload.level, exp: action.payload.exp, star: action.payload.star, energy: action.payload.energy,
        //         image: action.payload.image
        //     }
        //         : content)
        //     };
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