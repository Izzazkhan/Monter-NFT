export function getDearMonsters() {
    return dispatch => {
        return dispatch({
            type: 'GET_DEARMONSTERS'
        });
    }
};

export function addDearMonsters(data) {
    return dispatch => {
        return dispatch({
            type: 'ADD_DEARMONSTERS',
            payload: data
        });
    }
};

export function editDearMonsters(data) {
    return dispatch => {
        return dispatch({
            type: 'EDIT_DEARMONSTERS',
            payload: data
        });
    }
};

export function deleteDearMonsters(employeeId) {
    return dispatch => {
        return dispatch({
            type: 'DELETE_DEARMONSTERS',
            payload: employeeId
        });
    }
}; 