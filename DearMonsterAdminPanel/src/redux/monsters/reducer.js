const initialstate = {
    dearMonsters: [
        { id: 1, name: "DEARMONSTERS 1", element: ".NET Team", level: '3', exp: '2 months', star: '3 star', energy: 'full', image: '' },
        { id: 2, name: "DEARMONSTERS 2", element: "Mobile Team", level: '3', exp: '2 months', star: '3 star', energy: 'full', image: '' },
        { id: 3, name: "DEARMONSTERS 3", element: "Design Team", level: '3', exp: '2 months', star: '3 star', energy: 'full', image: '' }
    ]
};

const MonsterReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_DEARMONSTERS':
            return {
                ...state
            };
        case 'ADD_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: state.dearMonsters.concat(action.payload)
            };
        case 'EDIT_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: state.dearMonsters.map(
                    (content, i) => content.id === action.payload.id ? {
                        ...content, name: action.payload.name, element: action.payload.element
                        , level: action.payload.level, exp: action.payload.exp, star: action.payload.star, energy: action.payload.energy,
                        image: action.payload.image
                    }
                        : content)
            };
        case 'DELETE_DEARMONSTERS':
            return {
                ...state,
                dearMonsters: state.dearMonsters.filter(item => item.id !== action.payload)
            };
        default:
            return state;
    }
};

export default MonsterReducer;   