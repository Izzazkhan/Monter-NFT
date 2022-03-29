const initialstate = {
    shardType: []
};

const ShardTypeReducer = (state = initialstate, action) => {
    // console.log('action.payload', action.payload)
    switch (action.type) {
        case 'GET_SHARD_TYPE':
            return {
                ...state,
                shardType: action.payload.shardType,
            };
        case 'ADD_SHARD_TYPE':
            return {
                ...state,
                shardType: state.shardType.concat(action.payload)
            }
        case 'EDIT_SHARD_TYPE':
            return {
                ...state,
                shardType: state.shardType.map(content => content._id === action.payload._id ?
                    {
                        ...content,
                        typeName: action.payload.typeName,
                        image: action.payload.image
                    }
                    :
                    content
                )
            }
        case 'DELETE_SHARD_TYPE':
            return {
                ...state,
                shardType: state.shardType.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default ShardTypeReducer;   