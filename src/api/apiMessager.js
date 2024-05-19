
import axios from 'axios';
import API_CONFIG from './apiconfig';
export const deleteMessageAPI = async (messageId) => {
    const userId = localStorage.getItem("userId");
    console.log('userId:', userId);
    console.log('messageId:', messageId);
    try {
      const res = await axios.put(
        API_CONFIG.baseURL + API_CONFIG.endpoints.deleteMessage,
        { userId, messageId } 
      );
      console.log('deleteMessage:', res.data);
      return res.data;
    } catch (error) {
      throw new Error('Error getting user data');
    }
  }
  export const retrieveMessages = async (messageId) => {
    try {
      const res = await axios.post(
        API_CONFIG.baseURL + API_CONFIG.endpoints.retrieveMessages + `/${messageId}`,
      );
      console.log('retrieveMessages:', res.data);
      return res.data;
    } catch (error) {
      throw new Error('Error getting user data');
    }
  };
  export const notificationMessage = async (chatGroupId, userId, notification, token) => {
    try {
        console.log("chatGroupId", chatGroupId);
        console.log("userId", userId);
        console.log("notification", notification);
        const response = await axios.post(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.notificationMessage}`,
            {
                    chatGroupId,
                    userId,
                    notification
            },
            {
                headers: {
                    Authorization: token,
                }
            }
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.response?.data.error);
        return error.response;
    }
};
  