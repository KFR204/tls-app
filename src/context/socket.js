import React from "react";
import socketio from "socket.io-client";
const SOCKET_URL = "ws://localhost:3000";

export const socket = socketio.connect(SOCKET_URL);
export const SocketContext = React.createContext();
