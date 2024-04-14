const SERVER_IP = 'localhost';
// const SERVER_IP = '192.168.56.235';
// http://192.168.217.1:3000
const SERVER_PORT = '5000';
const API_BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}/api/`;
//192.168.1.232
const SOCKET_URL = `http://192.168.1.232:3000`;

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
    getListFriends:'user/listFriends'
  },
};

export default API_CONFIG;