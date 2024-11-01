const initialState = {
    status: null,
    user: null,
    room: null,
    canvasData: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_SOCKET_STATUS":
            return {
                ...state,
                status: action.payload
            };
        case "DRAW":
            return {
                ...state,
                canvasData: [...state.canvasData, action.payload]
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            };
        case "SET_ROOM":
            return {
                ...state,
                room: action.payload
            };
        default:
            return state;
    }
}

export const setSocketStatus = (status) => {
    return {
        type: "SOCKET_STATUS",
        payload: status
    };
}

export const draw = (data) => {
    return {
        type: "DRAW",
        payload: data
    };
}

export const setUser = (user) => {
    return {
        type: "SET_USER",
        payload: user
    };
}

export const setRoom = (room) => {
    return {
        type: "SET_ROOM",
        payload: room
    };
}

export default reducer;