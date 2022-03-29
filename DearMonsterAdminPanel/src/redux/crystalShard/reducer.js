const initialstate = {
    shards: []
};

const CrystalShardReducer = (state = initialstate, action) => {
    // console.log('action.payload', action.payload)
    switch (action.type) {
        case 'GET_CRYSTALSHARD':
            return {
                ...state,
                shards: action.payload.shards,
            };
        case 'ADD_CRYSTALSHARD':
            return {
                ...state,
                shards: state.shards.concat(action.payload)
            };
        case 'EDIT_CRYSTALSHARD':
            return {
                ...state,
                shards: state.shards.map(content => content._id === action.payload._id ?
                    {
                        ...content,
                        shardName: action.payload.shardName,
                        shardTypeId: action.payload.shardTypeId,
                        shardDescription: action.payload.shardDescription
                    }
                    :
                    content
                )
            };
        case 'DELETE_CRYSTALSHARD':
            return {
                ...state,
                shards: state.shards.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default CrystalShardReducer;   