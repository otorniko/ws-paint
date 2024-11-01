import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setSocketStatus } from "../reducers/socketReducer";

const socket = io("http://localhost:3001", {
  autoConnect: false,
  pingTimeout: 60000,
  pingInterval: 25000,
});

export const connect = () => {
socket.connect();
console.log('socket connected:', socket.connected);
};

export default socket;