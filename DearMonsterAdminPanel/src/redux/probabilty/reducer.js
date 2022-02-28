const initialstate = {
    probabilityList: []
};

const ProbabilityListReducer = (state = initialstate, action) => {
    console.log('stateeeeeee', state, action.payload)
    switch (action.type) {
        case 'GET_PROBABILITY':
            return {
                ...state,
                probabilityList: [...action.payload]
            }
        case 'ADD_PROBABILITY':
            return {
                ...state,
                probabilityList: state.probabilityList.concat(action.payload)
            };
        case 'EDIT_PROBABILITY':
            return {
                ...state,
                probabilityList: state.probabilityList.map(
                    (content, i) => content._id === action.payload._id ? {
                        ...content, prob_1: action.payload.prob_1, prob_2: action.payload.prob_2
                        , prob_3: action.payload.prob_3, prob_4: action.payload.values.prob_4,
                            prob_5: action.payload.values.prob_5,
                    }
                        : content)
            };
        case 'DELETE_PROBABILITY':
            return {
                ...state,
                probabilityList: state.probabilityList.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default ProbabilityListReducer;   