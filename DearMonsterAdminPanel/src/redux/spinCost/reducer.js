const initialstate = {
    spinCost: []
};

const SpinCostReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_SPIN_COST':
            return {
                ...state,
                spinCost: [...action.payload]
            }
        case 'ADD_SPIN_COST':
            return {
                ...state,
                spinCost: state.spinCost.concat(action.payload)
            };
        case 'EDIT_SPIN_COST':
            return {
                ...state,
                spinCost: state.spinCost.map(
                    (content, i) => content._id === action.payload._id ? {
                            ...content, spin_1_cost: action.payload.spin_1_cost, spin_5_cost: action.payload.spin_5_cost
                        }
                        : content)
            };
        case 'DELETE_SPIN_COST':
            return {
                ...state,
                spinCost: state.spinCost.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default SpinCostReducer;   