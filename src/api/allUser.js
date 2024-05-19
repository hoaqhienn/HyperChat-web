import axios from 'axios';
import {
  getUsersStart, // Action creator bắt đầu lấy danh sách người dùng
  getUsersSuccess, // Action creator lấy danh sách người dùng thành công
  getUsersFailure, // Action creator lấy danh sách người dùng thất bại
} from '../redux/userSlice'; // Import các action creator từ Redux slice userSlice
import API_CONFIG from './apiconfig'; // Import cấu hình API từ file apiconfig.js

// Hàm lấy tất cả người dùng từ server
const allUsers = () => async dispatch => {
  dispatch(getUsersStart()); // Dispatch action bắt đầu lấy danh sách người dùng

  try {
    const response = await axios.get(
      API_CONFIG.baseURL + API_CONFIG.endpoints.allUsers, // Gửi yêu cầu GET đến API để lấy danh sách người dùng
    );
    dispatch(getUsersSuccess(response.data)); // Dispatch action lấy danh sách người dùng thành công và truyền dữ liệu
    // console.log('All users:', response.data);
  } catch (error) {
    dispatch(getUsersFailure(error)); // Dispatch action lấy danh sách người dùng thất bại và truyền lỗi
    console.error('Error while fetching all users', error); // Log lỗi khi lấy danh sách người dùng thất bại
  }
};
// Hàm lấy danh sách bạn bè người dùng từ server
const getAllFriends = async userId => {
  const List = [];
  const token =  localStorage.getItem('userToken');
  try {
    const res = await axios.get(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getListFriends}/${userId}`,{
        headers: {
          "Authorization": token,
        },
      }
    );
    const listFriend = res.data; // Dữ liệu trả về từ yêu cầu
    console.log(res);
    // Lặp qua danh sách ID để lấy thông tin của từng bạn bè
    for (let i = 0; i < listFriend.length; i++) {
      const res = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getUser}${listFriend[i]._id}`, // Gửi yêu cầu GET đến API để lấy thông tin của người dùng dựa trên ID
      );
      List.push(res.data); // Thêm thông tin người dùng vào danh sách
    }
    return List; // Trả về danh sách yêu cầu kết bạn đã được xử lý
    // return requestData;

  } catch (error) {
    console.error('Error caught:', error); // Log lỗi khi có lỗi xảy ra
    throw error.response ? error.response.data.message : error.message; // Ném lỗi nếu có lỗi xảy ra
  }
};

// Hàm lấy yêu cầu kết bạn từ server dựa trên ID người dùng
const getRequests = async userId => {
  const List = []; // Khởi tạo mảng rỗng để lưu danh sách yêu cầu
  try {
    const res = await axios.get(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getRequests}/${userId}`, // Gửi yêu cầu GET đến API để lấy danh sách yêu cầu kết bạn của một người dùng
    );
    const requestData = res.data; // Dữ liệu trả về từ yêu cầu
    const idArray = requestData.map(item => item.sender); // Lấy danh sách ID của người gửi yêu cầu

    // Lặp qua danh sách ID để lấy thông tin của từng người dùng
    for (let i = 0; i < idArray.length; i++) {
      const res = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getUser}/${idArray[i]}`, // Gửi yêu cầu GET đến API để lấy thông tin của người dùng dựa trên ID
      );
      List.push(res.data); // Thêm thông tin người dùng vào danh sách
    }
    return List; // Trả về danh sách yêu cầu kết bạn đã được xử lý
    // return requestData;

  } catch (error) {
    console.error('Error caught:', error); // Log lỗi khi có lỗi xảy ra
    throw error.response ? error.response.data.message : error.message; // Ném lỗi nếu có lỗi xảy ra
  }
};
// hàm đăng nhập
const login = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.login}`;
const outchatgroup = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.outchatgroup}`;
const deleteChatGroup = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteChatGroup}`;
const sendMessagetoServer = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendMessagetoServer}`;
const getAllMessagesByChatId = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getAllMessagesByChatId}`;
const getAllChatGroupByUserId = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getAllChatGroupByUserId}`;
const addMembersToChatGroup = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addMembersToChatGroup}`;
const addAdminToChatGroup = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addAdminToChatGroup}`;
const deleteMembersChatGroup = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteMembersChatGroup}`;
const info = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.info}`;
const sendFriendRequest = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendFriendRequest}`;
const listchats = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.listchats}`;
const createChatGroup = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.createChatGroup}`;
const getUser = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getUser}`;
const update = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.update}`;
const acceptFriendRequest = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.acceptFriendRequest}`;
const deleteFriendRequest = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteFriendRequest}`;
const createChatPrivate = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.createChatPrivate}`;
const register = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.register}`;
const sendOTPForgotPwd = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendOTPForgotPwd}`;
const verify = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendOTPForgotPwd}`;
const verifyOTPForgotPwd = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.verifyOTPForgotPwd}`;
const changePasswords = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.changePassword}`;
const forwardMessage = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.forwardMessage}`;
const unFriend = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.unFriend}`;
// Xuất các hàm để sử dụng ở bên ngoài module
export {allUsers, getRequests,getAllFriends,login,outchatgroup,deleteChatGroup,sendMessagetoServer,
  getAllMessagesByChatId,getAllChatGroupByUserId,addMembersToChatGroup,addAdminToChatGroup,deleteMembersChatGroup,info,
  sendFriendRequest,listchats,createChatGroup,getUser,update,acceptFriendRequest,deleteFriendRequest,createChatPrivate,
  register,sendOTPForgotPwd,verify,verifyOTPForgotPwd,changePasswords,forwardMessage,unFriend
};