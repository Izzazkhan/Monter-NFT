const initialstate = {
    dearMonsters: []
};

const MonsterReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: action.payload

            };
        case 'ADD_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: state.dearMonsters.concat(action.payload)
            };
        case 'EDIT_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: state.dearMonsters.map(content => content._id === action.payload._id ?
                    {
                        ...content,
                        title: action.payload.title,
                        // img: action.payload.img,
                        cetagory: action.payload.cetagory,
                        totalRating: action.payload.totalRating,
                        price: action.payload.price
                    }
                    :
                    content
                )
            };
        case 'DELETE_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: state.dearMonsters.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default MonsterReducer;   