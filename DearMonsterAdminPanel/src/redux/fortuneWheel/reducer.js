const initialstate = {
    fortuneWheel: []
};

const FortuneWheelReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'GET_FORTUNE_WHEEL':
            return {
                ...state,
                fortuneWheel: [...action.payload]
            }
        case 'ADD_FORTUNE_WHEEL':
            return {
                ...state,
                fortuneWheel: state.fortuneWheel.concat(action.payload)
            };
        case 'EDIT_FORTUNE_WHEEL':
            return {
                ...state,
                fortuneWheel: state.fortuneWheel.map(
                    (content, i) => content._id === action.payload[0]._id ? {
                            ...content, wheelName: action.payload.wheelName, isActive: action.payload.isActive, slots: action.payload.option == undefined &&
                                action.payload.probability == undefined ? [...content.slots] : [
                                ...content.slots, { option: action.payload.option, probability: action.payload.probability, 
                                    actionType: action.payload.actionType, value: action.payload.value }
                            ]
                        }
                        : content)
            };
        case 'DELETE_FORTUNE_WHEEL':
            return {
                ...state,
                fortuneWheel: state.fortuneWheel.filter(item => item._id !== action.payload)
            };
        default:
            return state;
    }
};

export default FortuneWheelReducer;   