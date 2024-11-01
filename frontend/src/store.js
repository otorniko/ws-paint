import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./reducers/socketReducer";
import modalReducer from "./reducers/modalReducer";

const store = configureStore({
    reducer: {
        socket: socketReducer,
        modal: modalReducer,
    },
    });

export default store;