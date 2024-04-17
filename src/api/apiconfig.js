const SERVER_IP = '192.168.2.40';
const SERVER_PORT = '5000';
const SOCKET_PORT = '3000';
const API_BASE_URL = `http://localhost:${SERVER_PORT}/api/`;

//const SOCKET_URL = `http://localhost:${SOCKET_PORT}`;
// const SOCKET_URL = `http://3.107.1.0:3000`;
const SOCKET_URL = `http://${SERVER_IP}:3000`;
const API_CONFIG = {
  baseURL: API_BASE_URL,
  socket: SOCKET_URL,
  endpoints: {

    allUsers: 'user',
    login: 'user/login',
    getUser: 'user/id', 
    info: 'user/phone',
    register: 'user/register/send-otp',
    verify: 'user/register/verifyOTP',
    update: 'user/update',
    listchats: 'user/getListChats',
    sendOTPForgotPwd: 'user/sendOTPForgotPassword',
    verifyOTPForgotPwd: 'user/verifyOTPForgotPassword',
    changePassword: 'user/changePassword',
    getRequests: 'friends/getAllSendFriendRequest',
    deleteMessage: 'message/deleteMessage',
    getListFriends:'user/listFriends'
  },
};

export default API_CONFIG;