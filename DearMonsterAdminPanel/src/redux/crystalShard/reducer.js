const initialstate = {
    crystalShard: []
};

const CrystalShardReducer = (state = initialstate, action) => {
    console.log('action.payload', action.payload)
    switch (action.type) {
        case 'GET_CRYSTALSHARD':
            return {
                ...state,
                crystalShard: action.payload.cystalShard,
            };
        case 'ADD_CRYSTALSHARD':
            return {
                ...state,
                crystalShard: state.crystalShard.concat(action.payload)
            };
        case 'EDIT_CRYSTALSHARD':
            return {
                ...state,
                crystalShard: state.crystalShard.map(content => content._id === action.payload._id ?
                    {
                        ...content,
                        name: action.payload.name,
                        crystalImage: action.payload.crystalImage,
                        description: action.payload.description
                    }
                    :
                    content
                )
            };
        case 'DELETE_CRYSTALSHARD':
            return {
                ...state,
                crystalShard: state.crystalShard.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default CrystalShardReducer;   