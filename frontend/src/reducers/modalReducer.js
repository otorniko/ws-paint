const initialState = {
    open: false,
};

const modalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "OPEN_MODAL":
            return { open: true };
        case "CLOSE_MODAL":
            return { open: false };
        default:
            return state;
    }
}

export const openModal = () => {
    return {
        type: "OPEN_MODAL",
    };
};

export const closeModal = () => {
    return {
        type: "CLOSE_MODAL",
    };
};

export default modalReducer;