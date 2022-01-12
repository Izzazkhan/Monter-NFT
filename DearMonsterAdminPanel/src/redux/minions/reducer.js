const initialstate = {
    minions: []
};

const MinionReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_MINIONS':
            return {
                ...state,
                minions: [...action.payload]
            }
        case 'ADD_MINIONS':
            return {
                ...state,
                minions: state.minions.concat(action.payload)
            };
        case 'EDIT_MINIONS':
            return {
                ...state,
                minions: state.minions.map(
                    (content, i) => content.id === action.payload.id ? {
                        ...content, name: action.payload.name, element: action.payload.element
                        , level: action.payload.level, exp: action.payload.exp, star: action.payload.star, energy: action.payload.energy,
                        image: action.payload.image
                    }
                        : content)
            };
        case 'DELETE_MINIONS':
            return {
                ...state,
                minions: state.minions.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default MinionReducer;   