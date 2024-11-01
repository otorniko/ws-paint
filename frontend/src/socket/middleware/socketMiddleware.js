import socket from "..";
import { remoteDraw } from "../../reducers/socketReducer";

const socketMiddleware = (store) => (next) => (action) => {
    if (action.type === "SOCKET_CONNECT") {
        socket.connect();
    }

    if (action.type === "DRAW") {
        socket.emit("drawLine", action.payload);
    }
    
    if (action.type === "REMOTE_DRAW") {
        socket.on("draw", (data) => {
            store.dispatch(remoteDraw(data));
        });
    }
    
    return next(action);
    }

export default socketMiddleware;