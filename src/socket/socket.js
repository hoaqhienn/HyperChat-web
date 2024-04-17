import { io } from "socket.io-client";
import API_CONFIG from "../api/apiconfig";
export const socket = io.connect(API_CONFIG.socket);