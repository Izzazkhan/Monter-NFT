const initialstate = {
    bonus: []
};

const BonusReducer = (state = initialstate, action) => {
    console.log('state=', state, action)
    switch (action.type) {
        case 'GET_BONUS':
            return {
                ...state,
                bonus: [...action.payload]
            }
        case 'ADD_BONUS':
            return {
                ...state,
                bonus: state.bonus.concat(action.payload)
            };
        case 'EDIT_BONUS':
            return {
                ...state,
                bonus: state.bonus.map(
                    (content, i) => content._id === action.payload._id ? {
                        ...content, 1: action.payload['1'], 2: action.payload['2']
                        , 3: action.payload['3'], 4: action.payload['4'], 5: action.payload['5'], 6: action.payload['6'],
                        message: action.payload['message'],
                        image: action.payload.image
                    }
                        : content)
            };
        case 'DELETE_BONUS':
            return {
                ...state,
                bonus: state.bonus.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default BonusReducer